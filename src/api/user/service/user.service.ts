import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
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

  public async createUser(
    body: CreateUserDto,
  ): Promise<{ token: string; user }> {
    if (await this.mailExists(body.email)) {
      throw new HttpException('Email already taken', HttpStatus.CONFLICT);
    }

    const nameIsNum = /^\d+$/.test(body.name);
    const emailIsNum = /^\d+$/.test(body.email.split('@')[0]);
    if (nameIsNum || emailIsNum) {
      throw new HttpException(
        'Name & Email can not only contain numbers',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = await this.authService.hashPassword(body.password);

    const createdUser = await this.repository.save(user);

    if (!createdUser) {
      throw new HttpException('User was not saved!', HttpStatus.BAD_REQUEST);
    }

    const accessToken = await this.authService.generateJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  public async login(body: LoginUserDto): Promise<{ user; token: string }> {
    const user: User = await this.findUserByEmail(body.email);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const passwordMatches = await this.authService.comparePasswords(
      body.password,
      user.password,
    );

    if (!passwordMatches)
      throw new HttpException(
        'Login was not Successful',
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = await this.authService.generateJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  //   8888888b.  8888888b.  8888888 888     888     d8888 88888888888 8888888888
  // 888   Y88b 888   Y88b   888   888     888    d88888     888     888
  // 888    888 888    888   888   888     888   d88P888     888     888
  // 888   d88P 888   d88P   888   Y88b   d88P  d88P 888     888     8888888
  // 8888888P"  8888888P"    888    Y88b d88P  d88P  888     888     888
  // 888        888 T88b     888     Y88o88P  d88P   888     888     888
  // 888        888  T88b    888      Y888P  d8888888888     888     888
  // 888        888   T88b 8888888     Y8P  d88P     888     888     8888888888

  private async mailExists(email: string) {
    const acc = await this.repository.findOneBy({ email });
    if (acc) {
      return true;
    } else {
      return false;
    }
  }

  private async findUserByEmail(email: string) {
    return await this.repository.findOneBy({ email, isDeleted: false });
  }
}
