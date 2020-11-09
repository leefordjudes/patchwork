import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sale')
  async processSale(@Query() query: any) {
    const { from_date, to_date, sale_type } = query;
    if (!from_date || !to_date || !sale_type) {
      throw new BadRequestException('from_date, to_date, sale_type is required');
    }
    return await this.appService.processSale(from_date, to_date, sale_type);
  }
  /*
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
  */
}
