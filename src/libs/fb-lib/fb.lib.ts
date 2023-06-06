
import Axios, { AxiosResponse } from 'axios';
import { IAdSetModel, IGetAllAdSetData, IGetCurrentTokenParam } from './fb-lib.interfaces.lib';
import { plainToInstance } from 'class-transformer';
import { AdAccountDataDTO } from './dtos/ad-account-data-model.dto';
import { Wrappers } from 'src/wrappers/wrappers';
import { HttpException } from '@nestjs/common';

export class FbLib {
  static longLivedToken: string
  constructor() { }
  /**
   * 
   * For a given dataTimeDuration, the function returns a map with key being AdSetID and value the data associated with the adset
   * 
   */
  public static async getAllAdSetData(params: IGetAllAdSetData) {
    const { dataTimeDuration } = params
    let result: AxiosResponse<any, any>

    const task = async () => {
      const result = await Axios.get(
        `https://graph.facebook.com/v14.0/me?fields=adaccounts%7Badsets%7Badcreatives%7Bthumbnail_url%7D%2Cname%2Cads%7Bcreative%7D%2Cinsights%7Breach%2Cadset_id%2Cclicks%2Cimpressions%2Cdate_start%2Cdate_stop%2Csocial_spend%2Ccpp%2Cspend%2Cctr%7D%2Cadset_id%2Ccreative_sequence%7D%2Ccampaigns%7Bname%2Cobjective%2Cads%7Bcreative%2Ccampaign%2Cinsights%7Badset_id%2Cclicks%2Creach%2Cadset_name%2Cimpressions%2Cdate_start%2Cdate_stop%2Csocial_spend%2Cspend%2Ccpp%2Cctr%2Ccost_per_conversion%7D%7D%7D%7D&access_token=${FbLib.longLivedToken}`,
        {
          params: {
            date_preset: dataTimeDuration
          }
        }
      );
      return result
    }

    const catchCase = async (error) => { // check this error thing if it works
      if (Axios.isAxiosError(error)) {
        console.log(error.response);
      }
      console.log({
        fbLibError: "FBLib Get All AdsetData: will retry for 5 seconds",
        error
      });
    }
    //try {
    result = await Wrappers.retryWrapper({
      task,
      catchCase,
      delay: 5000,
      allowedTime: 15,
      failureMessage: 'FB Token error'
    }).catch((error) => {
      if (error instanceof Error) { // must create a class to extend error like HTTPException
        // TODO
        HttpException
      }

      // TODO
    })
    // can do .catch after the promise as well and catfch the error using an arrow function

    // } catch (error) {
    //   if (error instanceof Error) { 
    //     // TODO
    //   }
    //   // TODO
    // }


    if (!result) {
      return "Change FB Token likely expired or fatal error with FB Lib or API"
    }



    const adAccountData = plainToInstance(AdAccountDataDTO, result.data.adaccounts.data[0])
    const adSetArray = adAccountData.adsets.data
    const adSetMap = new Map<string, IAdSetModel>();

    // Skips adsets with no insights and creates an object with name and insight data which is mapped by id 
    for (const adSet of adSetArray) {
      const { id, name, insights, ads, adcreatives } = adSet
      if (!insights) {
        continue
      }
      const insightData = insights.data[0]
      const creativeId = ads.data[0].creative.id // this takes the image from the first ad
      const thumbnailURL = adcreatives.data[0].thumbnail_url
      const newAdSetData: IAdSetModel = {
        name,
        creativeId,
        url: thumbnailURL || null,
        insights: insightData
      }
      // FILTER: Filtering for Eatlab name tag all ads should be named EATLAB_
      // if (name.startsWith("EATLAB_")) {
      //   adSetMap.set(id, newAdSetData)
      // } 
      //OR
      adSetMap.set(id, newAdSetData)
    }

    return adSetMap
  }

  // public static async getCurrentToken(params: IGetCurrentTokenParam) {
  //   const { ssmLib } = params
  //   const currentToken = await ssmLib.getParameterSecureStringValue({
  //     Name: '/eatlabfbapp/FBLLUSserAccessToken'
  //   })
  //   FbLib.longLivedToken = currentToken
  //   return currentToken
  // }
  
  // how to use records
  // helo(object: Record<number, string>) {
  //   this.helo({
  //     1: 'helo'
  //   })
  // }
}