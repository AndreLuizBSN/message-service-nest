import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnstileService {
  constructor(private readonly config: ConfigService) {}

  async verify(token: string, ip?: string): Promise<void> {
    const secret = this.config.getOrThrow<string>('TURNSTILE_SECRET_KEY');

    const body = new URLSearchParams({
      secret,
      response: token,
    });

    if (ip) body.set('remoteip', ip);

    let result: {
      success: boolean;
      hostname?: string;
      action?: string;
    };

    try {
      const response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body,
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!response.ok) {
        throw new Error('Turnstile unavailable');
      }

      result = await response.json();
    } catch {
      throw new ForbiddenException('Unable to verify request');
    }

    const allowedHostnames = this.config
      .getOrThrow<string>('TURNSTILE_HOSTNAMES')
      .split(',')
      .map((value) => value.trim());

    if (
      !result.success ||
      !result.hostname ||
      !allowedHostnames.includes(result.hostname) ||
      result.action !== 'contact'
    ) {
      throw new ForbiddenException('Invalid verification');
    }
  }
}
