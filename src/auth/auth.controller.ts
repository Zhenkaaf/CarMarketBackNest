import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
/* В данном случае, когда запрос приходит на /auth/profile, будет вызван метод getProfile контроллера AuthController. Поскольку над методом установлен декоратор @UseGuards(JwtAuthGuard), это означает, что перед вызовом самого метода будет выполнена проверка аутентификации с использованием JWT-авторизации.
Если пользователь успешно прошел аутентификацию с помощью JWT, то в объекте req.user будут содержаться данные, которые были включены в JWT-токен при создании.  */
