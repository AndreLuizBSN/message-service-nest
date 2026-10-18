import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';
import { EmailProcessor } from './email.processor.js';
import { TurnstileService } from '../security/turnstile.service.js';
import { AbuseProtectionService } from '../security/abuse-protection.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter.js';
import { fileURLToPath } from 'node:url';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SSL === 'true',
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: { from: process.env.SMTP_EMAIL },
        template: {
          dir: fileURLToPath(new URL('../templates/', import.meta.url)),
          adapter: new PugAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    EmailProcessor,
    TurnstileService,
    AbuseProtectionService,
  ],
})
export class MessagesModule {}
