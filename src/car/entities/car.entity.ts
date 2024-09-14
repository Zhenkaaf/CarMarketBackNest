import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn({ name: 'carId' })
  carId: number;

  @Column()
  bodyType: string;

  @Column()
  carMake: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  price: number;

  @Column()
  mileage: number;

  @Column()
  fuelType: string;

  @Column()
  region: string;

  @Column({ nullable: true })
  desc: string;

  /*  @Column({ type: 'simple-array', nullable: true })
  photoUrls: string[]; */
  @Column({ type: 'jsonb', nullable: true })
  photos: { id: string; url: string }[];

  /*  @Column({ type: 'simple-array', nullable: true })
  mainPhotoUrl: string[]; */

  @ManyToOne(() => User, (user) => user.cars)
  @JoinColumn({ name: 'userId' })
  user: User; // при создании newCar вы должны использовать именно это имя - user.
  /* Когда вы сохраняете новый экземпляр Car, присваивая объект User полю user, TypeORM автоматически определит значение этого поля как идентификатор пользователя. В данном случае @JoinColumn({ name: 'userId' }) указывает, что идентификатор пользователя будет храниться в столбце с именем userId в таблице Car. В результате при сохранении нового автомобиля в базу данных в соответствующем столбце будет записан идентификатор пользователя.*/
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/* 
Этот код представляет собой аннотации или декораторы в TypeScript, используемые вместе с TypeORM для определения отношений между сущностями в базе данных.

@ManyToOne(() => User, (user) => user.cars):

@ManyToOne: Этот декоратор указывает, что у сущности Car существует отношение "многие к одному" с сущностью User.
() => User: Это функция, которая возвращает тип сущности, с которой устанавливается отношение. В данном случае это User.
(user) => user.cars: Это функция, которая указывает, какие свойства сущности User связаны с сущностью Car. Здесь мы указываем, что связь устанавливается через свойство cars сущности User, которое предположительно является массивом объектов Car.
@JoinColumn({ name: 'userId' }):

@JoinColumn: Этот декоратор указывает на столбец в таблице базы данных, который используется для хранения внешнего ключа отношения.
{ name: 'userId' }: Это опции декоратора, где name указывает на имя столбца, которое будет использоваться в таблице Car для хранения идентификатора пользователя (userId). */
