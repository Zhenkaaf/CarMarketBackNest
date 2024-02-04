import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isSuchUserExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (isSuchUserExist)
      throw new BadRequestException('User with such email already exist!');

    const isPhoneNumberUnique = await this.userRepository.findOne({
      where: {
        phoneNumber: createUserDto.phoneNumber,
      },
    });
    if (isPhoneNumberUnique) {
      throw new BadRequestException(
        'User with such phone number already exists!',
      );
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
      phoneNumber: createUserDto.phoneNumber,
      name: createUserDto.name,
    });

    const token = this.jwtService.sign({
      id: user.id,
      email: createUserDto.email,
    });

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      token,
    };

    /* try {
      const user = await this.userRepository.save({
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
        phoneNumber: createUserDto.phoneNumber,
        name: createUserDto.name,
      });

      const token = this.jwtService.sign({
        id: user.id,
        email: createUserDto.email,
      });

      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        token,
      };
    } catch (error) {
      
      if (error.code === '23505') {
        throw new ConflictException(
          'User with such email or phone number already exists!',
        );
      }
      throw error;
    } */
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
