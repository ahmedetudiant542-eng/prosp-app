import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  create(@Body() dto: CreateCampaignDto, @CurrentUser() user: any) {
    return this.campaignsService.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.campaignsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto, @CurrentUser() user: any) {
    return this.campaignsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.remove(id, user.id);
  }

  @Post(':id/prospects')
  addProspects(@Param('id') id: string, @Body() body: { prospectIds: string[] }, @CurrentUser() user: any) {
    return this.campaignsService.addProspects(id, body.prospectIds, user.id);
  }

  @Post(':id/launch')
  launch(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.launch(id, user.id);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.pause(id, user.id);
  }
}
