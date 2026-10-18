import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('email')
  message(@Body() data: Record<string, unknown>): Promise<void> {
    return this.service.sendEmail({
      subject: data.subject as string,
      template: data.template as string,
      to: data.to as string,
      context: data.context as ISendMailOptions['context'],
    });
  }
}
