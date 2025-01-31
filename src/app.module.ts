import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { CarModule } from './car/car.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('Database');
        console.log('appModule*********');
        logger.log(`POSTGRES_URL: ${configService.get('POSTGRES_URL')}`);
        const databaseUrl = configService.get('POSTGRES_URL');
        const caCertificate = configService.get('CA_CERTIFICATE');
        console.log('caCertificate*******************', caCertificate);
        const databaseConfig: TypeOrmModuleOptions = {
          /* host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'), */
          type: 'postgres',
          url: databaseUrl,
          ssl: {
            rejectUnauthorized: true,
            ca: caCertificate,
          },
          synchronize: true,
          //autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity{.js, .ts}'],
        };
        logger.log(`Database configuration: ${JSON.stringify(databaseConfig)}`);
        return databaseConfig;
      },
      inject: [ConfigService],
    }),
    CarModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
