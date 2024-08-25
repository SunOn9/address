import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { CityModule } from './city/city.module'
import { DistrictModule } from './district/district.module'
import { WardModule } from './ward/ward.module'
import { UtilsModule } from '@lib/utils'
import { HttpModule } from '@nestjs/axios'
import { CountryModule } from './country/country.module'
import { StateModule } from './state/state.module'
import { BullModule } from '@nestjs/bull'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { RedisxModule } from 'libs/core/components/redis/redis.module'
import { MyConfigModule } from './config/config.module'
import { CommonModule } from './common/common.module'
import { ZoneModule } from './zone/zone.module'
import { ScheduleModule } from '@nestjs/schedule'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { TypeOrmModule } from '@nestjs/typeorm'

// const cwd = process.cwd()
const synchronizeDatabaseStructure = process.env.APP_ENV == 'dev'

@Module({
  imports: [
    InMemoryDBModule.forRoot({}),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: synchronizeDatabaseStructure,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }
      },
    }),
    CommonModule,
    RedisxModule,
    MyConfigModule,
    UtilsModule,
    HttpModule,
    CityModule,
    DistrictModule,
    WardModule,
    CountryModule,
    StateModule,
    ZoneModule,
    ScheduleModule.forRoot(),
  ],

  providers: [],
})
export class AppModule {}
