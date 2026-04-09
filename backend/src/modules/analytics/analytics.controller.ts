import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getDashboard(user.id);
  }

  @Get('campaigns/:id')
  getCampaignStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.analyticsService.getCampaignStats(id, user.id);
  }

  @Get('trends')
  getTrends(@CurrentUser() user: any, @Query('days') days: string) {
    return this.analyticsService.getProspectTrends(user.id, parseInt(days) || 30);
  }
}
