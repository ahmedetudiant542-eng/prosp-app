import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { QueryProspectsDto } from './dto/query-prospects.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('prospects')
export class ProspectsController {
  constructor(private prospectsService: ProspectsService) {}

  @Post()
  create(@Body() dto: CreateProspectDto, @CurrentUser() user: any) {
    return this.prospectsService.create(dto, user.id);
  }

  @Get()
  findAll(@Query() query: QueryProspectsDto, @CurrentUser() user: any) {
    return this.prospectsService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.prospectsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProspectDto, @CurrentUser() user: any) {
    return this.prospectsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.prospectsService.remove(id, user.id);
  }

  @Post('bulk')
  bulkCreate(@Body() body: { prospects: CreateProspectDto[] }, @CurrentUser() user: any) {
    return this.prospectsService.bulkCreate(body.prospects, user.id);
  }
}
