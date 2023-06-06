import { Injectable } from '@nestjs/common';
import {
    IGen2DTableFromJSONWithArrays,
    IJSONArrayToTwoDArrayParam,
    IOneDArrayTOJSONParam,
    ITransposeMatrixParam,
    ITwoDArrayTOJSONParam,
} from './data-converter.lib.interfaces';
@Injectable()
export class DataConverter {
    /* 
          converts a 2D array table format into JSON format. The optional parameter transpose allows us to manipulate the matrix if needed
          It takes data stored as into
          [                           
              [
                  id,
                  name,
                  age
              
              ]
              [
                  1,
                  John,
                  25
              ]
          ]    
  
          {
              id: 1,
              name: "John",
              age: 25
          }
          The 2D array format comes from Google Sheets' formatting of an exported table. 
          The example above comes from a table that looks like the following
          id  name    age
          1   John    25
      */
    public static twoDArrayToJSON(params: ITwoDArrayTOJSONParam) {
        let {isTransposed, dataList} = params
        if (isTransposed === true) {
            dataList = DataConverter.transposeMatrix({
                dataList: dataList,
            });
        }

        const keyList = dataList[0];
        if (!keyList) {
            return [];
        }

        const outputList: any[] = [];
        for (let i = 1; i < dataList.length; i++) {
            if (keyList.length !== dataList[i].length) {
                continue;
            } // may change this to accept missing fields for each object
            const outputObj = {};
            for (let j = 0; j < dataList[i].length; j++) {
                const singleData = dataList[i][j];
                outputObj[keyList[j]] = singleData;
            }
            outputList.push(outputObj);
        }
        return outputList;
    }

    /*
          The transpose matrix function transposes the input matrix using a nested mapping. This is used
          for taking in Google Sheets data that isn't in the structure that the 2D array to JSON function is standardized 
          to handle    
      */

    public static transposeMatrix(params: ITransposeMatrixParam) {
        const {dataList} =  params
        const output = dataList[0].map((_, colI) =>
            dataList.map((row) => row[colI]),
        );
        const table: any[] = output
        return table;
    }

    /*
          JSONArrayToTwoDArray is the inverse function of the twoDArrayToJSON function. It gathers all the possible keys that 
          are found in all the objects in the JSON array and does not add repeating keys.
          It then adds the corresponding key value pairs to each object and pushes them into an array consisting of all the JSON objects  
      */
    // make parameters for inputs
    public static JSONArrayToTwoDArray(params: IJSONArrayToTwoDArrayParam) {
        const { jsonArray, isSingular } = params
        const { value } = jsonArray[0]

        if (isSingular === true) {
            return [[value]];
        } else {
            const keyArray = [];

            jsonArray.forEach((element) => {
                const foundKeys = Object.keys(element);
                const notFound = foundKeys.filter((key) => !keyArray.includes(key));
                keyArray.push(...notFound);
            });

            const table = [keyArray];
            for (let objIndex = 0; objIndex < jsonArray.length; objIndex++) {
                const objArray = [];
                for (let keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
                    try {
                    
                        objArray[keyIndex] = jsonArray[objIndex][keyArray[keyIndex]];
                    } catch (error) {
                        objArray[keyIndex] = null;
                    }
                }
                table.push(objArray);
            }
            table.shift()
            return table;
        }
    }

    /* 
          This function allows us to support the function getSheets/ where there is a single cell needed to be retrieved
          or only one row. Since a 1D array cannot have key and value pairs, due to the lack of information, we do not have 
          nor do we need to have an inverse function. 
  
          This function retrieves the row and returns a JSON object nested in an array.
      */
    public static oneDArrayToJSON(params: IOneDArrayTOJSONParam) {
        const { dataArray } = params
        return { values: dataArray[0] };
    }

    public static gen2DTableFromJSONWithArrays(params: IGen2DTableFromJSONWithArrays) {
        const {jsonTable, isTransposed} = params
        const toTranspose = isTransposed || false
        const table = [];
        for (const key in jsonTable) {
            const row = [key].concat(jsonTable[key]);
            table.push(row);
        }
        if (toTranspose) {
            return this.transposeMatrix({dataList:table})
        }
        return table;
    }
}