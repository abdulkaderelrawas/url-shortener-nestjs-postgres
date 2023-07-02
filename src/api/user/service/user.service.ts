import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user.dto';
import { User } from '../user.entity';
import { AuthService } from 'src/api/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  public async getUsers(): Promise<User[]> {
    return await this.repository.find();
  }

  public async getUser(id: number): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  public async createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = await this.authService.hashPassword(body.password);

    return await this.repository.save(user);
  }
}
