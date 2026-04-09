import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-message')
  generateMessage(@Body() body: { prospect: any; type: string; context?: string }) {
    return this.aiService.generateMessage(body.prospect, body.type, body.context);
  }

  @Post('enrich')
  enrich(@Body() body: { prospect: any }) {
    return this.aiService.enrichProspect(body.prospect);
  }

  @Post('subject-lines')
  subjectLines(@Body() body: { campaign: any }) {
    return this.aiService.generateSubjectLine(body.campaign);
  }
}
