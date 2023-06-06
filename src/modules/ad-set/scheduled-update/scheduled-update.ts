import { DataConverter } from "src/libs/data-converter/data-converter.lib";
import { FacebookDataDurationEnum } from "src/enums/fb-data-duration.enum";
import { FbLib } from "src/libs/fb-lib/fb.lib";
import { ICreateAdSetOnSheet, ICreateTableOfAllAdSetsParam, IGetReportForDurationParam } from "./scheduled-update.interfaces";

export class ScheduledUpdate {
    constructor() { }

    /*
    Creates a table for one particular adset, displaying its keys and values.
    */

    public async createAdSetOnSheet(params: ICreateAdSetOnSheet) {
        const { clientSheetsLib, adSetData, cell, sheetName } = params
        const twoDArray = DataConverter.JSONArrayToTwoDArray({
            jsonArray: adSetData,
            isSingular: false,
        });

        const correctedJSON = DataConverter.twoDArrayToJSON({
            dataList: twoDArray,
            isTransposed: true,
        });

        clientSheetsLib.gsPut({
            body: correctedJSON,
            sheet: sheetName,
            location: cell,
            isSingular: false,
        });
    }

    /**
     * Creates a table of displaying the keys and values for all adsets with avalable insights
     */

    private static async _createTableOfAllAdSets(params: ICreateTableOfAllAdSetsParam) {
        const { clientSheetsLib, sheetName, dataTimeDuration, ssmLib } = params
        const adData = await FbLib.getAllAdSetData({ dataTimeDuration: dataTimeDuration, ssmLib });

        if (adData === "Change FB Token likely expired or fatal error with FB Lib or API") {
            console.log("this is called");
            
            clientSheetsLib.gsPutArray({
                body: [["Error: FB Token likely expired contact developer to update token"]],
                sheet: sheetName,
                location: "A1",
                singular: true
            })

            throw "Change FB Token likely expired"
        }

        const adSetDataList = []
        const JSONTable: Record<string, any[]> = {}
        const attributeList = [
            'name',
            'adset_id',
            'image',
            'clicks',
            'reach',
            'impressions',
            'date_start',
            'date_stop',
            'social_spend',
            'spend',
            'cpp',
            'ctr',
        ];

        attributeList.forEach((values) => {
            JSONTable[values] = [];
        });
        adData.forEach((value) => {
            const { name, creativeId, insights, url } = value
            const newAdSetObject = {
                name,
                creativeId,
                image: `=image("${url}",2)`,
                ...insights,
            };

            adSetDataList.push(newAdSetObject);
        });
        adSetDataList.forEach((adSet) => {
            attributeList.forEach((keyVal) => {
                JSONTable[keyVal].push(adSet[keyVal])
            })
        })
        const twoDArrayTable = DataConverter.gen2DTableFromJSONWithArrays({ jsonTable: JSONTable, isTransposed: true })
        clientSheetsLib.gsPut({
            body: twoDArrayTable,
            sheet: sheetName,
            location: "A1",
            isSingular: false
        })
    }


    /**
     * Creates a table with keys and values for all AdSet datas given the input duration, a FacebookDataDurationEnum
     */

    public static async getReportForDuration(params: IGetReportForDurationParam) {
        const { clientSheetsLib, duration, position, ssmLib } = params
        try {
            const { day, month, year } = (() => {
                const today = new Date()
                today.setHours(today.getHours() + 7)
                const day = String(today.getDate())
                const month = String(today.getMonth() + 1)
                const year = today.getFullYear()
                return { day, month, year }
            })()
            let sheetName: string;

            switch (duration) {
                case FacebookDataDurationEnum.last_7d:
                    sheetName = `Week_${day}/${month}`
                    break;
                case FacebookDataDurationEnum.last_month:
                    sheetName = `Month_${month}/${year}`
            }

            await clientSheetsLib.gsNewSheet({
                sheetName
            })
            await this._createTableOfAllAdSets({
                cell: position || "A1",
                sheetName,
                dataTimeDuration: duration,
                clientSheetsLib,
                ssmLib
            })
        } catch (error) {
            console.log(error);
        }
    }
}