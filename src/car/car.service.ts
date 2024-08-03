import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private s3Service: S3Service,
  ) {}

  async create(createCarDto: CreateCarDto, userId: number) {
    console.log('CarServiceCreateOK');

    //const imageUrls = await this.uploadImagesToS3(imageFiles);
    const newCar = {
      bodyType: createCarDto.bodyType,
      carMake: createCarDto.carMake,
      model: createCarDto.model,
      year: createCarDto.year,
      price: createCarDto.price,
      mileage: createCarDto.mileage,
      fuelType: createCarDto.fuelType,
      city: createCarDto.city,
      desc: createCarDto.desc,
      //imageUrls: imageUrls,
      user: {
        // при создании newCar вы должны использовать именно это имя - user.
        id: userId,
        /* В объекте user, который используется при создании нового автомобиля, вы можете передавать только те поля, которые являются частью сущности User и представляют соответствующие свойства пользователя. 
        Если вы используете другое имя для объекта, но не изменяете соответствующее имя в сущности Car, то TypeORM не сможет правильно определить связь между Car и User, и поэтому значение userId не будет сохранено в базе данных.*/
      },
    };
    return await this.carRepository.save(newCar);
  }

  async findAll() {
    return await this.carRepository.find({
      order: { createdAt: 'DESC' }, // Сортировка по убыванию даты создания
    });
  }

  async findAllByUserId(userId: number) {
    return await this.carRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(carId: number) {
    const car = await this.carRepository.findOne({
      where: { carId },
      relations: {
        user: true,
      },
    });
    if (!car) throw new NotFoundException('Car not found');
    /* return car; */
    const partialUserData = new UserResponseDto(car.user);
    return {
      ...car,
      user: partialUserData,
    };
  }

  /*async update(carId: number, updateCarDto: UpdateCarDto, userId: number) {
    const car = await this.carRepository.findOne({
      where: { carId },
      relations: {
        user: true,
      },
    });

    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }

    if (car.user.id !== userId) {
      throw new ForbiddenException(
        `You do not have permission to update this car`,
      );
    }

    return await this.carRepository.update(carId, updateCarDto);
      const updatedCar = await this.carRepository.findOne(carId);
  return updatedCar;
  } */

  async update(carId: number, updateCarDto: UpdateCarDto, userId: number) {
    try {
      const car = await this.carRepository.findOne({
        where: { carId },
        relations: {
          user: true,
        },
      });

      if (!car) {
        throw new NotFoundException(`Car with id ${carId} not found`);
      }

      if (car.user.id !== userId) {
        throw new ForbiddenException(
          `You do not have permission to update this car`,
        );
      }

      await this.carRepository.update(carId, updateCarDto);

      return {
        status: 'success',
      };
    } catch (error) {
      console.error('Error updating car:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the car',
      );
    }
  }

  async remove(carId: number) {
    const car = await this.carRepository.findOne({
      where: { carId },
    });
    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }
    const photoUrls = car.photoUrls;
    try {
      const deleteRequests = photoUrls.map(async (url) => {
        // Extract key from URL
        const key = url.substring(url.lastIndexOf('/') + 1);
        await this.s3Service.deleteFile(key);
      });
      await Promise.all(deleteRequests);
      console.log('Photos deleted successfully');
    } catch (error) {
      console.error('Error deleting photos:', error);
    }
    await this.carRepository.delete(carId);
    //return `Car with id: ${carId} has been successfully deleted`;
    return {
      status: HttpStatus.OK,
      data: {
        message: `Car with id: ${carId} has been successfully deleted`,
      },
    };
  }

  async uploadPhotosToS3(photos: Express.Multer.File[], carId: number) {
    console.log('CarServiceUploadPhotosToS3');

    const car = await this.carRepository.findOne({
      where: { carId },
    });
    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }

    const photoUrls = [];
    for (const file of photos) {
      console.log('file', file);
      const bucketKey = `${file.fieldname}${Date.now()}`;
      const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
      photoUrls.push(fileUrl);
    }
    car.photoUrls = photoUrls;
    await this.carRepository.save(car);
  }
}
