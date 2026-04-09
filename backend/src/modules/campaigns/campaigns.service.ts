import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCampaignDto, userId: string) {
    const { prospectIds, ...data } = dto;
    const campaign = await this.prisma.campaign.create({
      data: {
        ...data,
        userId,
        ...(prospectIds?.length && {
          prospects: {
            create: prospectIds.map((id) => ({ prospectId: id })),
          },
        }),
      },
      include: { sequences: true, prospects: { include: { prospect: true } } },
    });
    return campaign;
  }

  async findAll(userId: string) {
    return this.prisma.campaign.findMany({
      where: { userId },
      include: {
        sequences: { orderBy: { order: 'asc' } },
        _count: { select: { prospects: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, userId },
      include: {
        sequences: { orderBy: { order: 'asc' } },
        prospects: { include: { prospect: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto, userId: string) {
    await this.findOne(id, userId);
    const { prospectIds, ...data } = dto;
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.campaign.delete({ where: { id } });
  }

  async addProspects(id: string, prospectIds: string[], userId: string) {
    await this.findOne(id, userId);
    await this.prisma.campaignProspect.createMany({
      data: prospectIds.map((pid) => ({ campaignId: id, prospectId: pid })),
      skipDuplicates: true,
    });
    return this.findOne(id, userId);
  }

  async launch(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.campaign.update({
      where: { id },
      data: { status: 'ACTIVE', startedAt: new Date() },
    });
  }

  async pause(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.campaign.update({ where: { id }, data: { status: 'PAUSED' } });
  }
}
