import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt.guard';
import { Url } from '../url.entity';
import { CreateUrlDto } from '../dto/url.dto';
import { UrlService } from '../service/url.service';
import { User } from 'src/api/auth/decorators/user.decorator';
import { User as IUser } from 'src/api/user/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
@UsePipes(new ValidationPipe())
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  public async createUrl(
    @Body() body: CreateUrlDto,
    @User() user: IUser,
  ): Promise<Url> {
    return await this.urlService.createShortUrl(body, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  public async getUrls(@User() user: IUser): Promise<Url[]> {
    return await this.urlService.getUrls(user);
  }

  @Get(':code')
  @HttpCode(200)
  public async getUrl(
    @Param('code')
    code: string,
  ): Promise<Url> {
    return await this.urlService.getUrl(code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':code')
  @HttpCode(200)
  public async deleteUrl(
    @User() user: IUser,
    @Param('code')
    urlCode: string,
  ): Promise<string> {
    return await this.urlService.deleteUrl(user, urlCode);
  }

  @Get(':code/clicks')
  @HttpCode(200)
  public async getUrlClicks(
    @Param('code')
    code: string,
  ): Promise<{ numOfClicks: number }> {
    return await this.urlService.getUrlClicks(code);
  }
}
