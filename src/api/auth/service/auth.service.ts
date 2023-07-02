import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/api/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(user) {
    const signInOptions = { expiresIn: '365d' };
    return await this.jwtService.signAsync({ user }, signInOptions);
  }

  async comparePasswords(newPassword: string, passwordHash: string) {
    return await bcrypt.compare(newPassword, passwordHash);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }
}
