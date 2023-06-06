import { DecryptCommand, DecryptCommandInput, KMSClient } from "@aws-sdk/client-kms";
import { Injectable } from "@nestjs/common";
import { IKMSDecryptParam } from "./aws-kms.lib.interfaces";

@Injectable()
export class KMSLib {
    private _kmsClient: KMSClient
    private _textEncoder: TextEncoder
    private _textDecoder: TextDecoder

    constructor() {
        this._kmsClient = new KMSClient({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: 'ap-southeast-1',
        })
        this._textEncoder = new TextEncoder() // always utf-8
        this._textDecoder = new TextDecoder('UTF-8')
    }

    public async kmsDecrypt(params: IKMSDecryptParam) {
        const {CiphertextBlob, KeyId} = params
        const input: DecryptCommandInput = {
            CiphertextBlob,
            KeyId
        }
        const decryptCommand = new DecryptCommand(input)
        const decryptedValue = await this._kmsClient.send(decryptCommand)
        return decryptedValue

    }
}