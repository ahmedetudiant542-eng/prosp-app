import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { LinkedinService } from '../linkedin/linkedin.service';
import { PrismaService } from '../prisma/prisma.service';

@Processor('automation')
export class AutomationProcessor {
  constructor(
    private email: EmailService,
    private whatsapp: WhatsappService,
    private linkedin: LinkedinService,
    private prisma: PrismaService,
  ) {}

  @Process('execute-step')
  async executeStep(job: Job) {
    const { campaignId, prospectId, sequenceId } = job.data;

    const [sequence, prospect] = await Promise.all([
      this.prisma.sequence.findUnique({ where: { id: sequenceId } }),
      this.prisma.prospect.findUnique({ where: { id: prospectId } }),
    ]);

    if (!sequence || !prospect) return;

    switch (sequence.type) {
      case 'EMAIL':
        if (prospect.email) {
          await this.email.sendEmail(prospect.email, sequence.subject || 'Hello', sequence.content);
        }
        break;
      case 'WHATSAPP':
        if (prospect.phone) {
          await this.whatsapp.sendMessage(prospect.phone, sequence.content);
        }
        break;
      case 'LINKEDIN_MESSAGE':
        if (prospect.linkedinUrl) {
          await this.linkedin.sendMessage(prospect.linkedinUrl, sequence.content);
        }
        break;
    }

    await this.prisma.activity.create({
      data: {
        type: sequence.type,
        description: `Sequence step executed: ${sequence.name}`,
        prospectId,
        metadata: { campaignId, sequenceId },
      },
    });
  }
}
