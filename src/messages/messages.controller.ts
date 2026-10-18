import {
  Body,
  Controller,
  Ip,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service.js';
import { AbuseProtectionService } from '../security/abuse-protection.service.js';
import { TurnstileService } from '../security/turnstile.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly turnstile: TurnstileService,
    private readonly abuse: AbuseProtectionService,
    private readonly messages: MessagesService,
  ) {}

  @Post('contact')
  @HttpCode(HttpStatus.ACCEPTED)
  async send(@Body() dto: SendMessageDto, @Ip() ip: string) {
    if (dto.website) {
      return { accepted: true };
    }

    await this.abuse.check(ip, dto.email);
    await this.turnstile.verify(dto.turnstileToken, ip);

    await this.messages.enqueue({
      name: dto.name,
      email: dto.email,
      message: dto.message,
    });

    return { accepted: true };
  }
}
