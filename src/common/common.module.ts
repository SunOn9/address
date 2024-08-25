import { Module } from '@nestjs/common'
import { CommonService } from './common.service'
import { HttpModule } from '@nestjs/axios'
import { MyConfigModule } from '@/config/config.module'
import { ZoneChartReflect } from './provider/common.proto'

@Module({
  imports: [HttpModule, MyConfigModule],
  providers: [CommonService, ZoneChartReflect],
  exports: [CommonService, ZoneChartReflect],
})
export class CommonModule {}
