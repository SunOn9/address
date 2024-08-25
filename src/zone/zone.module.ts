import { Module } from '@nestjs/common'
import { ZoneService } from './zone.service'
import { ZoneRepository } from './provider/zone.repository'
import { CommonModule } from '@/common/common.module'
import { ZoneController } from './zone.controller'
import { BullModule } from '@nestjs/bull'
import { QUEUE_ZONE } from './provider/zone.constant'
import { ZoneReflect } from './provider/zone.proto'
import { ZoneProcessor } from './processor/zone.processor'
import { ZoneFunction } from '@/zone/provider/zone.function'

@Module({
  imports: [
    CommonModule,
    BullModule.registerQueue({
      name: QUEUE_ZONE,
      defaultJobOptions: {
        attempts: 1000,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [ZoneController],
  providers: [
    ZoneService,
    ZoneRepository,
    ZoneReflect,
    ZoneProcessor,
    ZoneFunction,
  ],
  exports: [ZoneService, ZoneRepository, ZoneReflect],
})
export class ZoneModule {}
