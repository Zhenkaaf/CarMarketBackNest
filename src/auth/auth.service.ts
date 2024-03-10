import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException(`User with email: "${email}" not found`);
    }
    const isPasswordMatch = await argon2.verify(user.password, password);
    if (user && isPasswordMatch) {
      return user;
    }
    throw new UnauthorizedException('Email or password are incorrect');
  }

  async login(user: IUser) {
    const { id, email, phoneNumber, name, createdAt } = user;
    return {
      id,
      email,
      phoneNumber,
      name,
      createdAt,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
