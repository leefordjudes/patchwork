import { BadRequestException, Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sale')
  async processSale(@Query() query: any, @Res() res: Response) {
    const { from_date, to_date } = query;
    if (!from_date || !to_date) {
      throw new BadRequestException('from_date, to_date is required');
    }
    const sales = await this.appService.processSale(from_date, to_date);
    const fromDate = moment(from_date).format('DD-MMM-YYYY').toString();
    const toDate = moment(to_date).format('DD-MMM-YYYY').toString();
    const month = moment(to_date).format('MMM-YYYY').toString();
    console.log(month);
    const pdf: PDFKit.PDFDocument = await this.appService.generatePdf(sales, fromDate, toDate);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename=stationery-${month}-gst-report.pdf`);
    pdf.pipe(res)
    pdf.end();
  }
}
