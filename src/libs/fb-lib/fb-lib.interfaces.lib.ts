import { AdSetObjectInsightDTO } from './dtos/campaign-object-insight.dto';

export interface ICampaignObject {
  name: string;
  objective: string;
  creativeId: string;
  insights: AdSetObjectInsightDTO; // make new one
  url: string;
}

export interface IAdSetModel {
  name: string;
  creativeId: string;
  insights: AdSetObjectInsightDTO;
  url: string;
}

import { FacebookDataDurationEnum } from '../../enums/fb-data-duration.enum';
import { GraphVersions } from './enums/graph-api-versions.enum';
import { SSMLib } from '../aws-ssm-lib/aws-ssm.lib';

export interface IGetCampaignParam {
  version: GraphVersions;
  campaignId: number;
  dataDuration: FacebookDataDurationEnum;
  accessToken: string;
}

export interface IGetCampaignDataForIdParam {
  getForId : string
}

export interface IGetAllAdSetData {
  dataTimeDuration: FacebookDataDurationEnum
  ssmLib: SSMLib
}

export interface ICheckEatlabAdFilterParam {
  adSetName: string
}

export interface IGetCurrentTokenParam {
  ssmLib: SSMLib
}
export interface IInitParam {
  ssmLib: SSMLib
}