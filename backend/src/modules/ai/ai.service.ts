import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: config.get('openai.apiKey') });
  }

  async generateMessage(prospect: any, type: string, context?: string) {
    const prompt = `Write a professional ${type} outreach message for:
Name: ${prospect.firstName} ${prospect.lastName}
Company: ${prospect.company || 'Unknown'}
Job Title: ${prospect.jobTitle || 'Unknown'}
${context ? `Context: ${context}` : ''}

Keep it concise, personalized, and non-spammy. Max 150 words.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    return { message: completion.choices[0].message.content };
  }

  async enrichProspect(prospect: any) {
    const prompt = `Based on this prospect info, suggest improvements and additional insights:
Name: ${prospect.firstName} ${prospect.lastName}
Company: ${prospect.company}
Job Title: ${prospect.jobTitle}
Return JSON with: suggestedTags, outreachTips, companyInsights`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async generateSubjectLine(campaign: any) {
    const prompt = `Generate 5 email subject lines for a campaign named "${campaign.name}". Return as JSON array.`;
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(completion.choices[0].message.content);
  }
}
