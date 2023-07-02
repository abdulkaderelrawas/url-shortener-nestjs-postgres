import {
  Body,
  Controller,
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

@Controller('urls')
@UsePipes(new ValidationPipe())
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  public async createUrl(
    @Body() body: CreateUrlDto,
    @User() user: IUser,
  ): Promise<Url> {
    return await this.urlService.createShortUrl(body, user);
  }

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
}
