import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public longUrl: string;
}
