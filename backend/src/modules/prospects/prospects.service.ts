import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { QueryProspectsDto } from './dto/query-prospects.dto';

@Injectable()
export class ProspectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProspectDto, userId: string) {
    return this.prisma.prospect.create({
      data: { ...dto, userId },
    });
  }

  async findAll(query: QueryProspectsDto, userId: string) {
    const { search, status, company, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;
    if (company) where.company = { contains: company, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.prospect.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.prospect.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const prospect = await this.prisma.prospect.findFirst({
      where: { id, userId },
      include: { activities: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!prospect) throw new NotFoundException('Prospect not found');
    return prospect;
  }

  async update(id: string, dto: UpdateProspectDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.prospect.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.prospect.delete({ where: { id } });
  }

  async bulkCreate(prospects: CreateProspectDto[], userId: string) {
    const created = await this.prisma.prospect.createMany({
      data: prospects.map((p) => ({ ...p, userId })),
      skipDuplicates: true,
    });
    return created;
  }
}
