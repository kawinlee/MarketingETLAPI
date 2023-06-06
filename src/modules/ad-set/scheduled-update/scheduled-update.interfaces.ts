import { FacebookDataDurationEnum } from "src/enums/fb-data-duration.enum";
import { SSMLib } from "src/libs/aws-ssm-lib/aws-ssm.lib";
import { SheetsLib } from "src/libs/sheets-lib/sheets.lib";

export interface IGetReportForDurationParam {
  clientSheetsLib: SheetsLib
  duration: FacebookDataDurationEnum
  position?: string
  ssmLib: SSMLib
}

export interface ICampaignDataParam {
  cpm: string;
  clicks: string;
  reach: string;
  cpc: string;
  ctr: string;
  cpp: string;
  impressions: string;
  conversion_rate_ranking: string;
  date_start: string;
  date_stop: string;
}
export interface ICreateTableOfAllAdSetsParam {
  cell: string;
  sheetName: string;
  dataTimeDuration: FacebookDataDurationEnum
  clientSheetsLib: SheetsLib
  ssmLib: SSMLib
}

export interface ICreateAdSetOnSheet {
  clientSheetsLib: SheetsLib
  adSetData: any
  cell: string
  sheetName: string
}