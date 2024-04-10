import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), S3Module],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
