import { KMSLib } from "../aws-kms-lib/aws-kms.lib"

export interface IGetParameterValueParam{
    Name: string
}

export interface IPutParameterValueParam {
    Name
    Value: string
}