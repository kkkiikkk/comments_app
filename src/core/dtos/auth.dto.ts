// Core
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 50)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto extends PickType(SignupDto, [
  'username' as const,
  'password' as const,
]) {}
