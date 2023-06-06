import { GetParameterCommand, GetParameterCommandInput, PutParameterCommand, PutParameterCommandInput, PutParameterRequest, SSMClient } from "@aws-sdk/client-ssm";
import { Injectable } from "@nestjs/common";
import { FbLib } from "../fb-lib/fb.lib";
import { IGetParameterValueParam, IPutParameterValueParam } from "./aws-ssm.lib.interfaces";

@Injectable()
export class SSMLib {
    private _ssmClient: SSMClient
    private _textEncoder: TextEncoder
    private _textDecoder: TextDecoder
    constructor() {
        this._ssmClient = new SSMClient({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: 'ap-southeast-1',
        })
        this._textEncoder = new TextEncoder() // always utf-8
        this._textDecoder = new TextDecoder('UTF-8')
        this._setup()
    }

    public async getParameterSecureStringValue(params: IGetParameterValueParam) {
        const { Name } = params

        const input: GetParameterCommandInput = {
            Name,
            WithDecryption: true
        }
        const getParameterCommand = new GetParameterCommand(input)
        const parameterValue = await this._ssmClient.send(getParameterCommand)
        const decryptedParameterValue = this._textEncoder.encode(JSON.stringify(parameterValue.Parameter.Value))
        const decodedValue = this._textDecoder.decode(decryptedParameterValue)
        const cleanedResponse = decodedValue.replace('"', '')
        return cleanedResponse

    }

    public async putParameterValueOverwrite(params: IPutParameterValueParam) {
        const { Value, Name } = params
        const input: PutParameterCommandInput = {
            Name,
            Value,
            Overwrite: true
        }
        const putParameterCommand = new PutParameterCommand(input)
        await this._ssmClient.send(putParameterCommand)
    }

    private async _setup() { // function for setting up getting tokens 
        // TODO do the same for google sheets 
        const currentToken = await this.getParameterSecureStringValue({
            Name: '/eatlabfbapp/FBLLUSserAccessToken'
        })
        FbLib.longLivedToken = currentToken
    }
}