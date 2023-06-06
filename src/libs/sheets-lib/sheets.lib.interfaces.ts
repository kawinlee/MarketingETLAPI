export interface IGsDeleteParam {
  sheetName: string;
  cells: string;
}

export interface IGsGetParam {
  sheetName: string;
  cells: string;
}

export interface IGsPutParam {
  body: JSON[];
  sheet: string;
  location: string;
  isSingular: boolean;
  
}

export interface IGsPutArrayParam {
  body: any[][];
  sheet: string;
  location: string;
  singular: boolean;
}

export interface IGsNewSheetParam {
  sheetName: string
}
