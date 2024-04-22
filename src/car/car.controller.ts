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
  Options,
  UploadedFiles,
  UploadedFile,
  ParseUUIDPipe,
  Request,
  HttpStatus,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
    /*  @Req() req, */
  ) {
    console.log('carControllerInterceptors');
    await this.carService.uploadPhotosToS3(photos, +carId);
    return {
      status: HttpStatus.OK,
      message: 'Photos added successfully',
    };
  }

  /*
   @Post('create')
   @UseGuards(JwtAuthGuard) 
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor('images', 6))
  async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req,
  ) {
    const imageUrls = await this.carService.uploadImagesToS3(images);
    console.log('imageUrls', imageUrls);
    // Добавить URL-адреса изображений к DTO
    createCarDto.imageUrls = imageUrls;
    // console.log('Incoming request body:', createCarDto);
    // Вызвать метод создания с обновленным DTO
    return this.carService.create(createCarDto, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  @Post('upload-images')
  async addImageToRecipe(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req,
  ) {
    console.log(file);
    const { sub: email } = req.user;
    await this.carService.addFileToCar(file, id, email);
  } */

  /*   @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImages(@UploadedFiles() images) {
    console.log('Uploaded images:', images);
    return 'Images uploaded successfully';
  } */

  @Get('list')
  findAll() {
    return this.carService.findAll();
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
