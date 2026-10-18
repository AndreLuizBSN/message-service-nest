import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MessagesModule } from './messages/messages.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MessagesModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60_000,
        limit: 5,
      },
      {
        name: 'daily',
        ttl: 86_400_000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}
