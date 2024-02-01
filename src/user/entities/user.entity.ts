/* eslint-disable prettier/prettier */
/* import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity'; */
import {
  Column,
  CreateDateColumn,
  Entity,
  /* OneToMany, */
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  /*   @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE', // удаляем usera и его категории
  })
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[]; */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
