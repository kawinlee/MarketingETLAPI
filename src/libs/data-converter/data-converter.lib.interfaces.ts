export interface IOneDArrayTOJSONParam {
  dataArray: any[][];
}

export interface ITransposeMatrixParam {
  dataList: any[][];
}

export interface ITwoDArrayTOJSONParam {
  dataList: any[][];
  isTransposed: boolean;
}

export interface IJSONArrayToTwoDArrayParam {
  jsonArray: any[];
  isSingular: boolean;
}

export interface IGen2DTableFromJSONWithArrays {
  jsonTable: any
  isTransposed?: boolean
}