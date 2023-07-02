import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../user.entity';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt.guard';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  public async createUser(
    @Body() body: CreateUserDto,
  ): Promise<{ token: string; user }> {
    return await this.userService.createUser(body);
  }

  @Post('/login')
  @HttpCode(200)
  public async login(
    @Body() body: LoginUserDto,
  ): Promise<{ token: string; user }> {
    return await this.userService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  public async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  public async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUser(id);
  }
}
