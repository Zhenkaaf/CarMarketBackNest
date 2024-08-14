import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';
import { Car } from './car/entities/car.entity';
import { User } from './user/entities/user.entity';
config();

console.log(`DB_HOST: ${process.env.DB_HOST}`);

const configService = new ConfigService();
console.log(`DB_HOST: ${configService.get('DB_HOST')}`);
console.log(`DB_PORT: ${configService.get('DB_PORT')}`);
console.log(`DB_USERNAME: ${configService.get('DB_USERNAME')}`);
console.log(`DB_PASSWORD: ${configService.get('DB_PASSWORD')}`);
console.log(`DB_NAME: ${configService.get('DB_NAME')}`);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  //port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  //entities: [__dirname + '/car/entities/*.entity{.js,.ts}'],
  entities: [Car, User],
  //entities: [__dirname + '/**/*.entity{.js, .ts}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Путь к миграциям
  logging: true,
  synchronize: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    console.log(
      'Entities:',
      AppDataSource.entityMetadatas.map((meta) => meta.name),
    );
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
