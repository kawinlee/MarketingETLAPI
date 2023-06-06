import { Type } from "class-transformer";

class adSetInsightsDTO {
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

export class GetAdSetModelDTO {
    id: string;
    name: string;
    @Type(() => adSetInsightsDTO)
    insights: adSetInsightsDTO
}
