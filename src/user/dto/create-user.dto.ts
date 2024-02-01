import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be more than 6 symbols' })
  @MaxLength(16, { message: 'Password must be less than 16 symbols' })
  password: string;

  @Matches(/^\+380\d{9}$/, {
    message: 'Phone number must be in the format +380123456789',
  })
  phoneNumber: string;
}
