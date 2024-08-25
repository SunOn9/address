import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { CustomRpcExceptionFilter } from '@/exception.filter'

async function bootstrap() {
  //grpc service
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env['GRPC_URL'],
        package: ['fadovn_store'],
        loader: {
          longs: String,
          enums: String,
          json: true,
          defaults: true,
        },
        protoPath: [join(__dirname, '../../proto/api.proto')],
      },
      logger: ['error', 'warn', 'debug', 'verbose'],
    },
  )
  await grpcApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  )

  grpcApp.useGlobalFilters(new CustomRpcExceptionFilter())

  await grpcApp.listen()
  console.log(`GRPC is running on: ${process.env['GRPC_URL']}`)

  //http service

  //   const httpApp = await NestFactory.create(AppModule, {
  //     logger: ['error', 'warn', 'debug', 'verbose'],
  //   })
  //   httpApp.enableCors({
  //     credentials: true,
  //   })
  //   await httpApp.useGlobalPipes(
  //     new ValidationPipe({ whitelist: true, transform: true }),
  //   )
  //   httpApp.useGlobalFilters(new HttpExceptionFilter())
  //   const config = new DocumentBuilder()
  //     .setTitle('Vietnam Location')
  //     .setDescription('Vietnam Location')
  //     .setVersion('1.0')
  //     .addTag('fado')
  //     .build()
  //   const document = SwaggerModule.createDocument(httpApp, config)
  //   SwaggerModule.setup('api', httpApp, document)
  //
  //   await httpApp.listen(process.env['HTTP_PORT'])
  //   console.log(`Application is running on: ${await httpApp.getUrl()}`)
}

bootstrap()
