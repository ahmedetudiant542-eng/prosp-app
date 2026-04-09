import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userId: string) {
    const org = await this.prisma.organization.create({ data: { name } });
    await this.prisma.user.update({ where: { id: userId }, data: { organizationId: org.id } });
    return org;
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: { users: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({ where: { id }, data });
  }
}
