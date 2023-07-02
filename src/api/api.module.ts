import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './urls/url.module';

@Module({
  imports: [UserModule, AuthModule, UrlModule],
})
export class ApiModule {}
