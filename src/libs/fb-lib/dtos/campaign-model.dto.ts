import { Type } from 'class-transformer';

export class adInsightDTO {
  adset_name: string;
  adset_id: string;
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

class insightDataDTO {
  data: adInsightDTO[];
}

class AdsDataDTO {
  data: AdsDTO[];
}

export class GetCampaignModelDTO {
  @Type(() => AdsDataDTO)
  ads: AdsDataDTO;
  name: string;
  objective: string;
}

export class AdsDTO {
  creative: { id: string };
  @Type(() => insightDataDTO)
  insights: insightDataDTO;
  campaign: { id: string };
}
