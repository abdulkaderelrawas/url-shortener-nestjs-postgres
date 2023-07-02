import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../url.entity';
import { CreateUrlDto } from '../dto/url.dto';
import { User } from 'src/api/user/user.entity';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly repository: Repository<Url>,

    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
    const inCacheData = await this.cacheService.get<Url>(url.id.toString());

    if (inCacheData) {
      console.log('getting data from cache');
      return inCacheData;
    }

    if (!url) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    url.count++;

    await this.repository.save(url);

    console.log('setting data to cache with key: ', url.id.toString());
    await this.cacheService.set(url.id.toString(), url);
    const cachedData = await this.cacheService.get(url.id.toString());
    console.log('data set to cache', cachedData);

    return url;
  }

  public async getUrls(user: User): Promise<Url[]> {
    return await this.repository.findBy({ user: { id: user.id } });
  }

  public async deleteUrl(user: User, urlCode: string): Promise<string> {
    const url = await this.repository.findOneBy({
      urlCode,
      user: { id: user.id },
    });
    if (!url) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }
    url.isDeleted = true;

    await this.repository.save(url);

    return 'The Url is deleted successfully';
  }

  public async getUrlClicks(urlCode: string): Promise<{ numOfClicks: number }> {
    const url = await this.repository.findOneBy({ urlCode });
    if (!url) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    return { numOfClicks: url.count };
  }
}
