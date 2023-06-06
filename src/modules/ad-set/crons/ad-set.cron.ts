import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule'
import axios from "axios";
import { FacebookDataDurationEnum } from "src/enums/fb-data-duration.enum";
import { SSMLib } from "src/libs/aws-ssm-lib/aws-ssm.lib";
import { SheetsLib } from "src/libs/sheets-lib/sheets.lib";
import { ScheduledUpdate } from "../scheduled-update/scheduled-update";

@Injectable()
export class AdSetCron {
    constructor(
        private readonly clientSheetsLib: SheetsLib,
        private readonly clientSSMLib: SSMLib) { }

    /**
     * Midnight UTC+7 on the 1st of every month equivalent to 5pm on sunday UTC on the first day of the month
     *  */
    @Cron("0 17 1 * 0")
    public monthlyReport() {
        ScheduledUpdate.getReportForDuration({
            duration: FacebookDataDurationEnum.last_month,
            clientSheetsLib: this.clientSheetsLib,
            ssmLib: this.clientSSMLib
        })

    }

    /**
     * Midnight UTC+7 on Monday equivalent to 5pm on sunday UTC
     *  */
    @Cron("0 17 * * 0")
    public weeklyReport() {
        ScheduledUpdate.getReportForDuration({
            duration: FacebookDataDurationEnum.last_7d,
            clientSheetsLib: this.clientSheetsLib,
            ssmLib: this.clientSSMLib
        })

    }

    @Cron(CronExpression.EVERY_2ND_MONTH)
    public async regenLLToken() {
        const currentToken = await this.clientSSMLib.getParameterSecureStringValue({
            Name: "/eatlabfbapp/FBLLUSserAccessToken",
        })
        const rawLLTokenData = await axios.get(
            'https://graph.facebook.com/v14.0/oauth/access_token',
            {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: process.env.FB_LL_CLIENT_ID,
                    client_secret: process.env.FB_LL_CLIENT_SECRET,
                    fb_exchange_token: currentToken,
                },
            },
        );
        const newLLToken = JSON.stringify(rawLLTokenData.data.access_token);
        const cleanedToken = newLLToken.replace('"', '')
        await this.clientSSMLib.putParameterValueOverwrite({
            Name: "/eatlabfbapp/FBLLUSserAccessToken",
            Value: cleanedToken
        })
    }

    ///TEST
    // @Cron("*/30 * * * * *")
    // public async cronTest() {
    //     console.log("Cron calling");
        
    //     ScheduledUpdate.getReportForDuration({
    //         duration: FacebookDataDurationEnum.last_7d,
    //         clientSheetsLib: this.clientSheetsLib,
    //         ssmLib: this.clientSSMLib
    //     })
    // }
}