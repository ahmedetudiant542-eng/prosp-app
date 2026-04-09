import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('smtp.host'),
      port: config.get('smtp.port'),
      secure: false,
      auth: { user: config.get('smtp.user'), pass: config.get('smtp.pass') },
    });
  }

  async sendEmail(to: string, subject: string, html: string, from?: string) {
    return this.transporter.sendMail({
      from: from || this.config.get('smtp.from'),
      to,
      subject,
      html,
    });
  }

  async sendProspectEmail(prospect: any, subject: string, body: string) {
    if (!prospect.email) return null;
    return this.sendEmail(prospect.email, subject, `<p>${body}</p>`);
  }
}
