import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import * as keys from '../../../keys.json';
import { DataConverter } from '../data-converter/data-converter.lib';
import {
  IGsDeleteParam,
  IGsGetParam,
  IGsNewSheetParam,
  IGsPutArrayParam,
  IGsPutParam,
} from './sheets.lib.interfaces';

//DEPENDENCIES: data-converter is required for this library

@Injectable()
export class SheetsLib {
  private _sheetsClient: JWT;
  constructor() {
    this._sheetsClient = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    this._sheetsClient.authorize(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Connected to Google Sheets API');
      }
    });
  }
  // testing reading from the google sheet
  public async gsGet(params: IGsGetParam) {
    const { cells, sheetName } = params
    const gsapi = google.sheets({ version: 'v4', auth: this._sheetsClient });
    const cellEnds = cells.split(':');
    //This case takes in only one cell
    if (cellEnds[1] === undefined) {
      try {
        const result = await gsapi.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${sheetName}!${cellEnds[0]}`,
        });
        return DataConverter.oneDArrayToJSON({
          dataArray: result.data.values,
        });
      } catch (error) {
        // console.log({ sheetsLibError: "gsGet single cell given", error });
      }
      // Case 1: The data comes from a single cell
    } else {
      try {
        const result = await gsapi.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${params.sheetName}!${cellEnds[0]}:${cellEnds[1]}`,
        });
        // case 2: data is purely a row
        // \D means removing all non numerical characters and g means global
        if (cellEnds[0].replace(/\D/g, '') === cellEnds[1].replace(/\D/g, '')) {
          return DataConverter.oneDArrayToJSON({
            dataArray: result.data.values,
          });
          // case 3: Data from 2D array table
        } else {
          return DataConverter.twoDArrayToJSON({
            dataList: result.data.values,
            isTransposed: false,
          });
        }
      } catch (error) {
        // console.log({ sheetsLibError: "gsGet multi cell given", error });
      }
    }
  }

  public async gsPut(params: IGsPutParam) {
    const gsapi = google.sheets({ version: 'v4', auth: this._sheetsClient });
    const { isSingular, sheet, location, body } = params
    // Supports one cell entry i.e. only beginning cell
    if (isSingular) {
      try {
        await gsapi.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${sheet}!${location}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: DataConverter.JSONArrayToTwoDArray({
              jsonArray: body,
              isSingular: true,
            }),
          },
        });
      } catch (error) {
        // console.log({ sheetsLibError: "GsPut single cell givne", error });
      }
    } else {
      //SUPPORTS ONLY ONE CELL GIVEN
      try {
        await gsapi.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${sheet}!${location}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: DataConverter.JSONArrayToTwoDArray({
              jsonArray: body,
              isSingular: false,
            }),
          },
        });
      } catch (error) {
        // console.log({ sheetsLibError: "GsPut multi cell givne", error });
      }
    }
  }

  public async gsPutArray(params: IGsPutArrayParam) {
    const gsapi = google.sheets({ version: 'v4', auth: this._sheetsClient });
    const { singular, sheet, location, body } = params
    if (singular) {
      await gsapi.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
        range: `${sheet}!${location}`, // jsut write the first position how to get sheet names
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: body,
        },
      });
    } else {
      await gsapi.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
        range: `${sheet}!${location}`, // jsut write the first position how to get sheet names
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: DataConverter.JSONArrayToTwoDArray({
            jsonArray: body,
            isSingular: false,
          }),
        },
      });
    }
  }

  public async gsDelete(params: IGsDeleteParam) {
    const gsapi = google.sheets({ version: 'v4', auth: this._sheetsClient });
    const { cells, sheetName } = params
    const cellEnds = cells.split(':');
    if (cellEnds[1] != undefined) {
      try {
        await gsapi.spreadsheets.values.clear({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${sheetName}!${cellEnds[0]}:${cellEnds[1]}`,
        });
      } catch (error) {
        console.log({ sheetsLibError: "gsDelete single cell location given", error });
      }
    } else {
      try {
        await gsapi.spreadsheets.values.clear({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
          range: `${sheetName}!${cellEnds[0]}`,
        });
      } catch (error) {
        // console.log({ sheetsLibError: "gsDelete multi-cell location given", error });
      }
    }
  }

  public async gsNewSheet(params: IGsNewSheetParam) {
    const { sheetName } = params
    const gsapi = google.sheets({ version: 'v4', auth: this._sheetsClient })
    try {
      await gsapi.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_PROTOTYPE_DASHBOARD,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }
          ]
        }
      })
    } catch (error) {
      console.log({
        sheetsLibError: "gsNewSheet" 
        ,error
      });

    }
  }
}