import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as path from 'path';
import PdfMaker = require('pdfmake');
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { roundValue, textFormatter } from './util';
import { Sale } from './model/sale.interface';

const FONTS = {
  Roboto: {
    normal: path.join(__dirname, 'fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, 'fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, 'fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/Roboto-MediumItalic.ttf'),
  },
};

const pdfMaker = new PdfMaker(FONTS);

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Sale')
    private readonly saleModel: Model<Sale>,
  ) {}

  async processSale(from_date: string, to_date: string) {
    const sales = await this.saleModel.find({
      date: { $gte: new Date(from_date), $lte: new Date(to_date) },
      saleType: 'credit',
    });

    const result = [];
    for (const sale of sales) {
      const customerName = sale?.customer?.displayName
      ? sale.customer.displayName
      : sale?.customer?.name 
      ? sale.customer.name
      : '';
      const data = {
        billDate: moment(sale.date).format('DD-MM-YYYY').toString(),
        billNo: sale.voucherNo,
        customerName:customerName,
        customerGSTNo: sale.gstInfo?.destination?.gstNo
          ? sale.gstInfo.destination.gstNo
          : '',
      };
      // const taxableAmount = _.reduce(
      //   sale.invTrns,
      //   (s, n) => s + n.taxableAmount,
      //   0,
      // );
      const groupedTax = _.groupBy(sale.invTrns, x =>
        x.tax ? x.tax.name : null,
      );
      let gst5 = 0,
        cgst5 = 0,
        sgst5 = 0;
      const t5 = 'GST 5%';
      if (groupedTax.hasOwnProperty(t5)) {
        cgst5 = roundValue(
          _.reduce(groupedTax[t5], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst5 = roundValue(
          _.reduce(groupedTax[t5], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst5 = roundValue(
          _.reduce(groupedTax[t5], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }

      let gst12 = 0,
        cgst12 = 0,
        sgst12 = 0;
      const t12 = 'GST 12%';
      if (groupedTax.hasOwnProperty(t12)) {
        cgst12 = roundValue(
          _.reduce(groupedTax[t12], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst12 = roundValue(
          _.reduce(groupedTax[t12], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst12 = roundValue(
          _.reduce(groupedTax[t12], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }

      let gst18 = 0,
        cgst18 = 0,
        sgst18 = 0;
      const t18 = 'GST 18%';
      if (groupedTax.hasOwnProperty(t18)) {
        cgst18 = roundValue(
          _.reduce(groupedTax[t18], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst18 = roundValue(
          _.reduce(groupedTax[t18], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst18 = roundValue(
          _.reduce(groupedTax[t18], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }

      let gst28 = 0,
        cgst28 = 0,
        sgst28 = 0;
      const t28 = 'GST 28%';
      if (groupedTax.hasOwnProperty(t28)) {
        cgst28 = roundValue(
          _.reduce(groupedTax[t28], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst28 = roundValue(
          _.reduce(groupedTax[t28], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst28 = roundValue(
          _.reduce(groupedTax[t28], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }

      const total = gst5 + gst12 + gst18 + gst28;
      _.assign(data, {
        totalTaxableAmount: roundValue(total, 2).toFixed(2),
        netAmount: roundValue(sale.amount, 2).toFixed(2),
      });

      result.push(data);
    }
    return result;

  }

  async generatePdf(sales: any[], fromDate: string, toDate: string) {
    const tableContentRow = [];
    for (let i=0; i<sales.length; i++) {
      tableContentRow.push([ 
        {text: i+1,style: 'tablerow', alignment: 'center'}, 
        {text: sales[i].billDate, style: 'tablerow', alignment: 'left'}, 
        {text: sales[i].billNo, style: 'tablerow', alignment: 'left'}, 
        {text: sales[i].customerName, style: 'tablerow', alignment: 'left'}, 
        {text: sales[i].customerGSTNo, style: 'tablerow', alignment: 'left'}, 
        {text: sales[i].totalTaxableAmount, style: 'tablerow', alignment: 'right'},  
        {text: sales[i].netAmount, style: 'tablerow', alignment: 'right'}, 
      ]);
    }
    const docDef: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 15, 15, 15, 15 ],
      content: [
        {text: 'VELAVAN HYPER MARKET BOOKS & STATIONERY', style: 'headline'},
        {text: '45, GIN FACTORY ROAD, TUTICORIN - 628 002', style: 'sub_headline'},
        {text: 'LANDLINE NO: - 0461 2383801, MOBILE NO:- 9842019102, 7373779102', style: 'sub_headline'},
        {
          columns: [
            {
              width: '2%',
              text: ''
            },
            {
              width: '*',
              text: 'Sale Tax Report',
              bold: true,
            },
            {
              width: '15%',
              text: [{text: 'From : ', bold: true},{text: fromDate}]
            },
            {
              width: '12%',
              text: [{text: 'To : ', bold: true}, {text: toDate}]
            }
          ],
          columnGap: 10,
          lineHeight: 1.4
        },
        {
          layout: {
            paddingTop: (i) =>  ( i === 0 ? 0 : 3),
            paddingBottom: (i) =>  ( i === 0 ? 0 : 3),
          },
          table: {
            headerRows: 1,
            widths: [ '4%', '9%', '12%', '*', '15%', '10%', '10%' ],
            body: [
              [ 
                {text: 'SlNo', style: 'tableheading', alignment: 'center'}, 
                {text: 'Bill Date', style: 'tableheading', alignment: 'center'},
                {text: 'Bill No', style: 'tableheading', alignment: 'center'},
                {text: 'Customer Name', style: 'tableheading', alignment:'center'},
                {text: 'Customer GSTNo', style: 'tableheading', alignment:'left'},
                {text: 'Total Taxable Amount', style: 'tableheading', alignment: 'right'},
                {text: 'NET Amount',style: 'tableheading', alignment: 'right'} 
              ],
              ...tableContentRow,
            ]
          }
        }
      ],
      styles: {
        headline: {
          fontSize: 13,
          bold: true,
          lineHeight: 1.3,
          alignment: 'center',
        },
        sub_headline: {
          fontSize: 10,
          bold: true,
          lineHeight: 1.2,
          alignment: 'center',
        },
        tableheading: {
          bold: true,
          fontSize: 12,
          lineHeight: 1,
        },
        tablerow: {
          fontSize: 11,
        }
      },
    };
    return pdfMaker.createPdfKitDocument(docDef, {});
  }

}  

