import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  HttpStatus,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createCarDto: CreateCarDto, @Req() req) {
    console.log('Incoming request body:', createCarDto);
    const newCar = await this.carService.create(createCarDto, +req.user.id);
    return {
      status: HttpStatus.CREATED,
      message: 'Car created successfully',
      data: newCar,
    };
  }

  /* @UseGuards(JwtAuthGuard) */
  @Post('add-photos/:carId')
  /*  @UsePipes(new ValidationPipe()) Если стандартные встроенные валидации не срабатывают, возможно, это связано с тем, что параметр imageUrls не проходит через ValidationPipe в вашем методе addImagesToCar. Проверьте, передается ли imageUrls в этот метод как параметр запроса (query parameter) или тела запроса (request body). */
  @UseInterceptors(FilesInterceptor('photos', 7))
  async addPhotosToCar(
    @UploadedFiles() photos: Express.Multer.File[],
    @Param('carId') carId: string,
  ) {
    console.log('carControllerInterceptors');
    await this.carService.uploadPhotosToS3(photos, +carId);
    return {
      status: HttpStatus.OK,
      message: 'Photos added successfully',
    };
  }

  @Get('list')
  findAll() {
    return this.carService.findAll();
  }

  @Get('/my-cars/:userId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  findAllByUserId(@Param('userId') userId: string) {
    return this.carService.findAllByUserId(+userId);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor) //для исключения пароля из ответа
  findOne(@Param('id') carId: string) {
    return this.carService.findOne(+carId);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  /* ValidationPipe, который встроен в NestJS и предназначен для автоматической валидации входных данных на основе классов DTO (Data Transfer Objects) и декораторов проверки класса class-validator. Когда запрос поступает на обработку в контроллер, ValidationPipe автоматически проверяет тело запроса (переданное через @Body()), параметры маршрута (переданные через @Param()), а также другие входные данные на соответствие определенным правилам валидации, указанным в DTO или через декораторы проверки. */
  update(
    @Param('id') carId: string,
    @Body() updateCarDto: UpdateCarDto,
    @Req() req,
  ) {
    return this.carService.update(+carId, updateCarDto, +req.user.id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') carId: string) {
    return this.carService.remove(+carId);
  }
}
