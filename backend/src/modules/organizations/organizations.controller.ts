import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgService: OrganizationsService) {}

  @Post()
  create(@Body('name') name: string, @CurrentUser() user: any) {
    return this.orgService.create(name, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.orgService.update(id, body);
  }
}
