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
    try {
      const cars = await this.carRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
      if (cars.length === 0) {
        return [];
      }
      return cars;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw new InternalServerErrorException('Failed to retrieve cars');
    }
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
    console.log('updateCarDto***********', updateCarDto);
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
      /*  if (updateCarDto.photosToDelete) {
        const remainingPhotoUrls = car.photos.filter((photo) => {
          return !updateCarDto.photosToDelete.includes(photo.url);
        });
        console.log('remainingPhotoUrls', remainingPhotoUrls);
        car.photoUrls = remainingPhotoUrls;

        const res = await this.deletePhotosFromS3(updateCarDto.photosToDelete);
        console.log('afterDeletePhotos', res);
      } */
      //Object.assign(car, updateCarDto); — объединяет оставшиеся поля из updateCarDto в объект car
      // Обновление остальных полей
      /*  const { photoUrls, ...carUpdates } = updateCarDto;
      Object.assign(car, carUpdates);
      await this.carRepository.save(car); */
      //нельзя! update вы изменили какие-то поля в объекте car, а потом вызываете update, эти изменения не будут сохранены, потому что update обновляет только те поля, которые присутствуют в updateCarDto
      //await this.carRepository.update(carId, updateCarDto);
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
    await this.deletePhotosFromS3(car.photos);
    await this.carRepository.delete(carId);
    //return `Car with id: ${carId} has been successfully deleted`;
    return {
      status: HttpStatus.OK,
      data: {
        message: `Car with id: ${carId} has been successfully deleted`,
      },
    };
  }

  async uploadPhotosToS3(
    photos: Express.Multer.File[],
    photoIds: string[],
    carId: number,
  ) {
    console.log('CarServiceUploadPhotosToS3');
    const car = await this.carRepository.findOne({
      where: { carId },
    });
    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }
    const photosInfo: { url: string; id: string }[] = [];
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const id = photoIds[i];
      const bucketKey = `${file.originalname}${Date.now()}`;
      const photoUrl = await this.s3Service.uploadFile(file, bucketKey);
      photosInfo.push({ url: photoUrl, id });
    }
    car.photos = photosInfo;
    await this.carRepository.save(car);
    /* const photoUrls = car.photoUrls || [];
    for (const file of photos) {
      console.log('file', file);
      const bucketKey = `${file.fieldname}${Date.now()}`;
      const fileUrl = await this.s3Service.uploadFile(file, bucketKey);
      photoUrls.push(fileUrl);
    }
    car.photoUrls = photoUrls;
    await this.carRepository.save(car); */
  }

  //async deletePhotosFromS3(photoUrls: string[]) {
  async deletePhotosFromS3(photos: { url: string; id: string }[]) {
    console.log('CarServiceDELETEPhotosFromS3');
    try {
      const deleteRequests = photos.map(async (photo) => {
        const key = photo.url.substring(photo.url.lastIndexOf('/') + 1);
        await this.s3Service.deleteFile(key);
      });
      await Promise.all(deleteRequests);
      console.log('Photos deleted successfully');
    } catch (error) {
      console.error('Error deleting photos:', error);
    }
  }
}
