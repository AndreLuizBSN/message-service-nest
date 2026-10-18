import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue('emails')
    private readonly queue: Queue,
  ) {}

  async enqueue(data: ContactMessage) {
    await this.queue.add('contact', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: {
        age: 3600,
      },
      removeOnFail: {
        age: 86400,
      },
    });
  }
}
