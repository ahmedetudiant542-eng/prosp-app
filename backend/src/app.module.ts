import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import configuration from './config/configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProspectsModule } from './modules/prospects/prospects.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SequencesModule } from './modules/sequences/sequences.module';
import { AutomationModule } from './modules/automation/automation.module';
import { AiModule } from './modules/ai/ai.module';
import { EmailModule } from './modules/email/email.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { LinkedinModule } from './modules/linkedin/linkedin.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_URL
          ? new URL(process.env.REDIS_URL).hostname
          : 'localhost',
        port: process.env.REDIS_URL
          ? parseInt(new URL(process.env.REDIS_URL).port) || 6379
          : 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProspectsModule,
    CampaignsModule,
    AnalyticsModule,
    SequencesModule,
    AutomationModule,
    AiModule,
    EmailModule,
    WhatsappModule,
    LinkedinModule,
    OrganizationsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
