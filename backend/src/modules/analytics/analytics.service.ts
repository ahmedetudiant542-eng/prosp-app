import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [totalProspects, totalCampaigns, prospectsByStatus, recentProspects] =
      await this.prisma.$transaction([
        this.prisma.prospect.count({ where: { userId } }),
        this.prisma.campaign.count({ where: { userId } }),
        this.prisma.prospect.groupBy({
          by: ['status'],
          where: { userId },
          _count: true,
        }),
        this.prisma.prospect.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    const activeCampaigns = await this.prisma.campaign.count({
      where: { userId, status: 'ACTIVE' },
    });

    return {
      stats: {
        totalProspects,
        totalCampaigns,
        activeCampaigns,
        conversionRate: this.calcConversion(prospectsByStatus),
      },
      prospectsByStatus,
      recentProspects,
    };
  }

  async getCampaignStats(campaignId: string, userId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
      include: {
        prospects: true,
        _count: { select: { prospects: true } },
      },
    });

    const byStatus = campaign?.prospects.reduce((acc: any, cp) => {
      acc[cp.status] = (acc[cp.status] || 0) + 1;
      return acc;
    }, {});

    return { campaign, byStatus };
  }

  async getProspectTrends(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const prospects = await this.prisma.prospect.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    });

    return prospects;
  }

  private calcConversion(statusGroups: any[]) {
    const total = statusGroups.reduce((s, g) => s + g._count, 0);
    const converted = statusGroups.find((g) => g.status === 'CONVERTED')?._count || 0;
    return total ? Math.round((converted / total) * 100) : 0;
  }
}
