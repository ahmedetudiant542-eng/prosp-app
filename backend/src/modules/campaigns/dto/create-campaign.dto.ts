import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { CampaignType } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @IsOptional()
  @IsArray()
  prospectIds?: string[];
}
