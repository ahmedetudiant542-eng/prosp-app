export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  organizationId?: string;
  createdAt: string;
}

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  status: ProspectStatus;
  source?: string;
  notes?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProspectStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "INTERESTED"
  | "NOT_INTERESTED"
  | "CONVERTED"
  | "ARCHIVED";

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  type: CampaignType;
  userId: string;
  createdAt: string;
  _count?: { prospects: number };
}

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
export type CampaignType = "EMAIL" | "LINKEDIN" | "WHATSAPP" | "MULTICHANNEL";

export interface Sequence {
  id: string;
  name: string;
  order: number;
  type: string;
  delay: number;
  delayUnit: string;
  subject?: string;
  content: string;
  campaignId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
