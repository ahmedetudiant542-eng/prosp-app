import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  constructor(private config: ConfigService) {}

  async sendMessage(to: string, body: string) {
    const accountSid = this.config.get('twilio.accountSid');
    const authToken = this.config.get('twilio.authToken');
    if (!accountSid || !authToken) {
      return { status: 'skipped', reason: 'Twilio not configured' };
    }
    const Twilio = require('twilio');
    const client = Twilio(accountSid, authToken);
    return client.messages.create({
      from: this.config.get('twilio.whatsappFrom'),
      to: `whatsapp:${to}`,
      body,
    });
  }
}
