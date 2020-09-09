import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('m1creditsale')
  async processM1CreditSale(@Query() query: any) {
    const { from_date, to_date } = query;
    return await this.appService.processM1CreditSale(from_date, to_date);
  }

  @Get('m1cashsale')
  async processM1CashSale(@Query() query: any) {
    const { from_date, to_date } = query;
    return await this.appService.processM1CashSale(from_date, to_date);
  }
}
