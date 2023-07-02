import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../url.entity';
import { CreateUrlDto } from '../dto/url.dto';
import { User } from 'src/api/user/user.entity';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly repository: Repository<Url>,
  ) {}

  public async createShortUrl(body: CreateUrlDto, user: User): Promise<Url> {
    const { longUrl } = body;
    if (!isURL(body.longUrl)) {
      throw new HttpException(
        'String Must be a Valid URL',
        HttpStatus.BAD_REQUEST,
      );
    }

    const urlCode = nanoid(10);
    const baseURL = 'http://localhost:3000';

    let url = await this.repository.findOneBy({ longUrl });

    if (url) return url;

    const shortUrl = `${baseURL}/${urlCode}`;

    const newUrl: Url = new Url();

    newUrl.longUrl = longUrl;
    newUrl.shortUrl = shortUrl;
    newUrl.user = user;
    newUrl.urlCode = urlCode;
    newUrl.count = 0;

    await this.repository.save(newUrl);

    return newUrl;
  }

  public async getUrl(urlCode: string): Promise<Url> {
    const url = await this.repository.findOneBy({ urlCode });
    if (!url) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    url.count++;

    await this.repository.save(url);

    return url;
  }

  public async getUrls(user: User): Promise<Url[]> {
    return await this.repository.findBy({ user: { id: user.id } });
  }
}
