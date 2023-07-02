import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
