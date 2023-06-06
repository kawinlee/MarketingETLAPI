import { Type } from 'class-transformer';

class AdSetInsightDTO {
  adset_name: string;
  clicks: string;
  reach: string;
  impressions: string;
  date_start: string;
  date_stop: string;
  social_spend: string;
  spend: string;
  cpp: string;
  ctr: string;
}

class insightsDataDTO {
  data: AdSetInsightDTO[];
}

export class GetCampaignAsClassDTO {
  id: number;
  @Type(() => insightsDataDTO)
  insights: insightsDataDTO;
  name: string;
  objective: string;
}
