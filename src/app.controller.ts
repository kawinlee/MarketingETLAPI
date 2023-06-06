import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('newToken/:newToken')
  async resetLLToken(@Param() params) {
    const rawLLTokenData = await axios.get(
      'https://graph.facebook.com/v14.0/oauth/access_token',
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FB_LL_CLIENT_ID,
          client_secret: process.env.FB_LL_CLIENT_SECRET,
          fb_exchange_token: params.newToken,
        },
      },
    );
    const newLLToken = JSON.stringify(rawLLTokenData.data.access_token);
    process.env.FB_LONGLIVED_ACCESS_TOKEN = newLLToken; // save this into another file
  }
}
