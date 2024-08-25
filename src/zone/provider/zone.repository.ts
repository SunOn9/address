import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
// import { Cache } from 'cache-manager'
// import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { err, ok, Result } from 'neverthrow'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { UtilsService } from '@lib/utils/utils.service'
import CustomException from '@lib/utils/custom.exception'
import * as CONST from './zone.constant'
import { ZoneEntity } from '../entities/zone.entity'
import { ZoneReflect } from './zone.proto'
import { Zone } from '@generated/zone/zone'
import { ZoneListDataReply } from '@generated/zone/zone_reply'
import { GetZoneConditionRequestDto } from '../dto/get-zone-condition.dto'
import { enumZone_ZonePartnerToNumber } from '@generated/zone/zone'

@Injectable()
export class ZoneRepository extends Repository<ZoneEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: ZoneReflect,
    private utilService: UtilsService,
  ) {
    super(ZoneEntity, dataSource.createEntityManager())
  }

  async createZone(
    createData: Partial<ZoneEntity>,
  ): Promise<Result<Zone, Error>> {
    try {
      const zoneData = await this.save(createData)

      if (!zoneData) {
        return err(new Error(CONST.ERROR_CANNOT_CREATE))
      }

      return ok(this.proto.reflect(zoneData))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  // async updateZone(
  //   id: number,
  //   updateData: Partial<ZoneEntity>,
  // ): Promise<Result<Zone, Error>> {
  //   try {
  //     if (!id) {
  //       return err(new Error(`Empty condition`))
  //     }
  //
  //     const oldData = await this.getDetail({ id })
  //
  //     if (oldData.isErr()) {
  //       return err(oldData.error)
  //     }
  //
  //     const { ...other } = updateData
  //
  //     await this.save({
  //       ...other,
  //     })
  //
  //     return await this.getDetail({
  //       id,
  //     })
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async getDetail(
    conditions: GetZoneConditionRequestDto,
  ): Promise<Result<Zone, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(CONST.ERROR_EMPTY_CONDITION))
      }

      const queryBuilder = this.setupQueryCondition(conditions)
      const zoneData = await queryBuilder.getOne()
      if (!zoneData) {
        const errorMessage = this.utilService.generateErrorMessage(conditions)
        return err(new Error(CONST.ERROR_CANNOT_FIND + `[ ${errorMessage} ]`))
      }

      return ok(this.proto.reflect(zoneData))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetZoneConditionRequestDto,
  ): Promise<Result<ZoneListDataReply, Error>> {
    try {
      // if (this.utilService.isObjectEmpty(conditions)) {
      //   return err(new Error(CONST.ERROR_EMPTY_CONDITION))
      // }

      const queryBuilder = this.setupQueryCondition(conditions)

      const [zoneListData, total] = await queryBuilder
        .orderBy(`id`, 'ASC')

        .getManyAndCount()

      if (!zoneListData) {
        const errorMessage = this.utilService.generateErrorMessage(conditions)
        return err(new Error(CONST.ERROR_CANNOT_FIND + `[ ${errorMessage} ]`))
      }

      const zoneList: Zone[] = []

      for (const zoneEntityData of zoneListData) {
        zoneList.push(this.proto.reflect(zoneEntityData))
      }

      const zoneListResponse = {
        zoneList,
        total,
      } as ZoneListDataReply

      return ok(zoneListResponse)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  setupQueryCondition(
    conditions: GetZoneConditionRequestDto,
  ): SelectQueryBuilder<ZoneEntity> {
    const queryBuilder = this.createQueryBuilder(ZoneEntity.tableName)

    if (conditions.zipcode !== undefined) {
      queryBuilder.andWhere(`${ZoneEntity.tableName}.zipcode = :zipcode`, {
        zipcode: conditions.zipcode,
      })
    }

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`${ZoneEntity.tableName}.id = :id`, {
        id: conditions.id,
      })
    }

    if (conditions.zoneType !== undefined) {
      queryBuilder.andWhere(`${ZoneEntity.tableName}.zone_type = :zoneType`, {
        zoneType: enumZone_ZonePartnerToNumber(conditions.zoneType),
      })
    }

    // console.log(queryBuilder)
    return queryBuilder
  }
}
