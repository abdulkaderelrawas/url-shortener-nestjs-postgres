import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { AuthModule } from '../auth/auth.module';
import { UrlController } from './controller/url.controller';
import { UrlService } from './service/url.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), forwardRef(() => AuthModule)],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
