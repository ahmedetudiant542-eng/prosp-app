import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkedinService {
  async sendConnectionRequest(prospectLinkedinUrl: string, message?: string) {
    return {
      status: 'queued',
      message: 'LinkedIn automation requires browser extension integration',
      prospect: prospectLinkedinUrl,
    };
  }

  async sendMessage(prospectLinkedinUrl: string, content: string) {
    return {
      status: 'queued',
      content,
      prospect: prospectLinkedinUrl,
    };
  }
}
