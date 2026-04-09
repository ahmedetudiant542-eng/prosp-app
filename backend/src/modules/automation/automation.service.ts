import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AutomationService {
  constructor(@InjectQueue('automation') private queue: Queue) {}

  async scheduleStep(data: {
    campaignId: string;
    prospectId: string;
    sequenceId: string;
    delayMs: number;
  }) {
    return this.queue.add('execute-step', data, { delay: data.delayMs });
  }

  async cancelCampaignJobs(campaignId: string) {
    const jobs = await this.queue.getJobs(['waiting', 'delayed', 'active']);
    for (const job of jobs) {
      if (job.data.campaignId === campaignId) await job.remove();
    }
  }
}
