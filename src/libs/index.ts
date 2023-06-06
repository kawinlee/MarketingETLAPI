import { KMSLib } from './aws-kms-lib/aws-kms.lib';
import { SSMLib } from './aws-ssm-lib/aws-ssm.lib';
import { FbLib } from './fb-lib/fb.lib';
import { SheetsLib } from './sheets-lib/sheets.lib';

export const Libs = [FbLib, SheetsLib, SSMLib, KMSLib];