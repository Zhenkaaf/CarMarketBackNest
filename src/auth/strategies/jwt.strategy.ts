import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/types/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(dataFromToken: IUser) {
    console.log('dataFromToken***', dataFromToken);
    const user = await this.userService.findOne(dataFromToken.email);
    console.log('user***', user);
    return {
      id: dataFromToken.id,
      email: dataFromToken.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
/* При использовании стратегии JWT аутентификации, библиотека Passport автоматически извлекает данные из токена и передает их в функцию validate */
