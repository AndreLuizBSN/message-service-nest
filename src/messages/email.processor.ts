import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException } from '@nestjs/common';

@Processor('emails', {
  concurrency: 2,
  limiter: {
    max: 10,
    duration: 60_000,
  },
})
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: MailerService) {
    super();
  }

  async process(job: Job) {
    try {
      if (job.name !== 'contact') {
        throw new Error('Unsupported job');
      }

      const { name, email, message } = job.data;

      await this.emailService.sendMail({
        to: email,
        from: process.env.SMTP_EMAIL,
        subject: 'TeVUI - New contact message',
        template: 'contact-customer.pug',
        context: {
          name: name,
          message: message,
        },
      });

      await this.emailService.sendMail({
        to: process.env.CONTACT_EMAIL!,
        from: process.env.SMTP_EMAIL,
        subject: `TeVUI - New contact message - ${name} - ${email}`,
        template: 'contact-copy.pug',
        context: {
          name: name,
          email: email,
          message: message,
        },
      });
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
