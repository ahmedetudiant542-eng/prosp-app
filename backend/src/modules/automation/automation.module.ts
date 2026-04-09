import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AutomationService } from './automation.service';
import { AutomationProcessor } from './automation.processor';
import { EmailModule } from '../email/email.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { LinkedinModule } from '../linkedin/linkedin.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'automation' }),
    EmailModule,
    WhatsappModule,
    LinkedinModule,
  ],
  providers: [AutomationService, AutomationProcessor],
  exports: [AutomationService],
})
export class AutomationModule {}
