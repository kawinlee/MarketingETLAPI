import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { FacebookDataDurationEnum } from 'src/enums/fb-data-duration.enum';
import { SSMLib } from 'src/libs/aws-ssm-lib/aws-ssm.lib';
import { DataConverter } from 'src/libs/data-converter/data-converter.lib';
import { SheetsLib } from 'src/libs/sheets-lib/sheets.lib';
import { AdSetService } from './ad-set.service';
import { ScheduledUpdate } from './scheduled-update/scheduled-update';


@Controller('adset')
export class AdSetController {
  constructor(
    private readonly adSetService: AdSetService,
    private readonly clientSheetsLib: SheetsLib,
    private readonly clientSSMLib: SSMLib
  ) {}

  /* 
      Gets data from a Google Sheet after taking in the path parameter cells. cells is expected to be in the format of 
      A1:B4 for a range
      or A1 for a single value
  
      Areas of Work: Need to support changing the sheet we want to get data from
  */
  @Get('sheetsGet/:cells')
  async getSheet(@Param('cells') cells: string): Promise<any> {
    return await this.clientSheetsLib.gsGet({
      sheetName: 'Sheet1',
      cells: cells,
    });
  }

  /* 
      Puts data into a Google Sheet after taking in the path parameter cells. cells is expected to be in the format of 
      A1:B4 for a range
      or A1 for a single value
  
      A body in the form of a JSON array, that is JSON objects inside an array is needed. This will map into a table with labels
      on the top and corresponding values below. 
      e.g. id  name    age
            1   John    25
  
      Areas of Work: Need to support changing the sheet we want to get data from
  */

  @Put('sheetsPut/:cell')
  async editSheet(@Param('cell') cell: string, @Body() body: JSON[]) {
    this.clientSheetsLib.gsPut({
      body: body,
      sheet: 'Sheet1',
      location: cell,
      isSingular: false,
    });
    return DataConverter.JSONArrayToTwoDArray({
      jsonArray: body,
      isSingular: false,
    });
  }

  @Put('sheetsPutSingleton/:cell')
  async editSheetSingleton(@Param('cell') cell: string, @Body() body: JSON[]) {
    this.clientSheetsLib.gsPut({
      body: body,
      sheet: 'Sheet1',
      location: cell,
      isSingular: true,
    });
    return DataConverter.JSONArrayToTwoDArray({
      jsonArray: body,
      isSingular: true,
    });
    // NOTE: for singular cell put in { value: "test" }
  }

  /* 
      Deletes values from a Google Sheet after taking in the path parameter cells. cells is expected to be in the format of 
      A1:B4 for a range
      or A1 for a single value
  
      Areas of Work: Need to support changing the sheet we want to get data from
  */

  @Delete('sheetsDelete/:cells')
  async deleteSheet(@Param('cells') cells: string) {
    return this.clientSheetsLib.gsDelete({
      sheetName: 'Sheet1',
      cells: cells,
    });
  }

  

  @Get('test')
  async test(){
    ScheduledUpdate.getReportForDuration({
      duration: FacebookDataDurationEnum.last_7d,
      clientSheetsLib: this.clientSheetsLib,
      ssmLib: this.clientSSMLib
  })
  }
}
