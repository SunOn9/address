import IntervalTree, { Interval } from '@flatten-js/interval-tree'
// import { UtilsService } from '@lib/utils'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ZoneRepository } from './provider/zone.repository'
import { Zone, ZoneData } from '@generated/zone/zone'
import { GetZoneByZipcodeRequestDto } from './dto/get-zone-by-zipcode.dto'
import { err, ok, Result } from 'neverthrow'
import * as CONST from './provider/zone.constant'
import { REDIS_ZONE_CHANEL, REDIS_ZONE_MESSAGE } from './provider/zone.constant'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RedisxService } from 'libs/core/components/redis/redis.service'
import { ZoneFunction } from '@/zone/provider/zone.function'
import { RedisPubSubService } from 'libs/core/components/redis/redis-pubsub.service'

@Injectable()
export class ZoneService implements OnModuleInit {
  private dataZone: Map<string, IntervalTree<string>>

  constructor(
    private readonly repo: ZoneRepository,
    private readonly redisxService: RedisxService,
    private readonly zoneFunction: ZoneFunction,
    private readonly redisPubSubService: RedisPubSubService,
    @InjectQueue(CONST.QUEUE_ZONE) private readonly queue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCronCrawl() {
    const resp = await this.redisxService.setnx(CONST.ZONE_CRON_KEY_CRAWL, 1)

    if (resp.isOk() && resp.value) {
      await this.redisxService.expire(
        CONST.ZONE_CRON_KEY_CRAWL,
        3600, // next hour
      )
      console.log('Cron running crawl zone')

      await this.initZoneUSPS()
    }

    //TODO: zone ups...
  }

  @Cron('0 1 1 * *') // EVERY_1ST_DAY_OF_MONTH_AT_1_AM
  async handleCronIntervalTree() {
    const resp = await this.redisxService.setnx(CONST.ZONE_CRON_KEY_TREE, 1)

    if (resp.isOk() && resp.value) {
      await this.redisxService.expire(
        CONST.ZONE_CRON_KEY_TREE,
        3600, // next hour
      )
      console.log('Cron running init interval tree')

      console.log('bắt đầu gửi message cho các cluster đang subscribe channel')
      this.redisPubSubService.publish(REDIS_ZONE_CHANEL, REDIS_ZONE_MESSAGE)
    }
  }

  async onModuleInit() {
    await this.initIntervalTree()

    this.redisPubSubService.subscribe(REDIS_ZONE_CHANEL, (channel, message) => {
      console.log(`Received the following message from ${channel}: ${message}`)
      // nếu trong channel có message sync thì init lại interval tree
      if (message === REDIS_ZONE_MESSAGE) {
        this.initIntervalTree()
      }
    })
  }

  async getZoneByZipcode(
    request: GetZoneByZipcodeRequestDto,
  ): Promise<Result<string, Error>> {
    try {
      const zipcode3From = request.zipcodeFrom.substring(0, 3)
      const zipcode3To = request.zipcodeTo.substring(0, 3)

      const keyGetException = this.zoneFunction.genKeyTreeException(
        zipcode3From,
        request.zoneType,
      )
      const treeException = this.dataZone.get(keyGetException)

      if (treeException !== undefined) {
        // search exception first with zip5
        const valuesException = treeException.search([
          parseInt(request.zipcodeTo),
          parseInt(request.zipcodeTo),
        ])

        // if exits
        if (valuesException[0]) {
          const row: string = JSON.parse(valuesException[0])
          if (row) {
            return ok(row)
          }

          return err(new Error('Can not parse zone'))
        }
      }

      // otherwise search zip3

      const keyGet = this.zoneFunction.genKeyTree(
        zipcode3From,
        request.zoneType,
      )
      const tree = this.dataZone.get(keyGet)
      if (tree !== undefined) {
        const values = tree.search([parseInt(zipcode3To), parseInt(zipcode3To)])

        // if exits
        if (values[0]) {
          const row: string = JSON.parse(values[0])
          if (row) {
            return ok(row)
          }

          return err(new Error('Can not parse zone'))
        }
      }
    } catch (error) {}

    return err(new Error('Can not find zone'))
  }

  async initZoneUSPS(): Promise<Result<boolean, Error>> {
    for (let i = CONST.START_ZIPCODE; i <= CONST.END_ZIPCODE; i++) {
      await this.queue.add(
        CONST.PROCESS_ZONE_INIT_USPS,
        this.zoneFunction.numberToZip3(i),
      )
    }

    return ok(true)
  }

  private async initIntervalTree() {
    const listAllZone = await this.repo.getList({})
    if (listAllZone.isOk()) {
      this.dataZone = this.createMapIntervalTree(listAllZone.value.zoneList)
    }
  }

  private createIntervalTree(dataList: ZoneData[]) {
    const tree = new IntervalTree<string>()

    for (const data of dataList) {
      if (data.zipcodeFrom !== undefined) {
        const zoneString = JSON.stringify(data.zone)
        if (data.zipcodeTo) {
          tree.insert(
            new Interval(data.zipcodeFrom, data.zipcodeTo),
            zoneString,
          )
        } else {
          tree.insert(
            new Interval(data.zipcodeFrom, data.zipcodeFrom),
            zoneString,
          )
        }
      }
    }

    return tree
  }

  private createMapIntervalTree(listAllZone: Zone[]) {
    const dataZoneTemp = new Map<string, IntervalTree<string>>()

    for (const zone of listAllZone) {
      const tree = this.createIntervalTree(zone.data)
      const key = this.zoneFunction.genKeyTree(zone.zipcode, zone.zoneType)
      dataZoneTemp.set(key, tree)

      const treeException = this.createIntervalTree(zone.exceptionData)
      const keyException = this.zoneFunction.genKeyTreeException(
        zone.zipcode,
        zone.zoneType,
      )
      dataZoneTemp.set(keyException, treeException)
    }

    return dataZoneTemp
  }
}
