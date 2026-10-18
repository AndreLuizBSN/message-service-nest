import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const received = request.headers['x-api-key'];
    const expected = this.config.get<string>('MESSAGE_API_KEY');

    if (
      typeof received !== 'string' ||
      !expected ||
      Buffer.byteLength(received) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(received), Buffer.from(expected))
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
