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

  async processCreditSale(from_date: string, to_date: string) {
    const sales = await this.saleModel
      .find({
        date: { $gte: new Date(from_date), $lte: new Date(to_date) },
        saleType: 'credit',
      })
      .sort({ date: 1 });

    const result = [];
    for (const sale of sales) {
      const customerName = sale?.customer?.displayName
        ? sale.customer.displayName
        : sale?.customer?.name
        ? sale.customer.name
        : '';
      const data = {
        billDate: moment(sale.date)
          .format('DD-MM-YYYY')
          .toString(),
        billNo: sale.voucherNo,
        customerName: customerName,
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
      let gst0 = 0,
        cgst0 = 0,
        sgst0 = 0;
      const t0 = 'GST 0%';
      if (groupedTax.hasOwnProperty(t0)) {
        cgst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst3 = 0,
        cgst3 = 0,
        sgst3 = 0;
      const t3 = 'GST 3%';
      if (groupedTax.hasOwnProperty(t3)) {
        cgst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
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

      const total = gst0 + gst3 + gst5 + gst12 + gst18 + gst28;
      _.assign(data, {
        totalTaxableAmount: roundValue(total, 2).toFixed(2),
        netAmount: roundValue(sale.amount, 2).toFixed(2),
      });

      result.push(data);
    }
    return result;
  }
  async processCashSale(from_date: string, to_date: string) {
    let cashSales = await this.saleModel.aggregate([
      {
        $match: {
          date: { $gte: new Date(from_date), $lte: new Date(to_date) },
          saleType: 'cash',
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          date: { $dateToString: { format: '%d-%m-%Y', date: '$date' } },
          amount: 1,
          invTrns: {
            $map: {
              input: '$invTrns',
              as: 'invTrn',
              in: {
                cgstAmount: '$$invTrn.cgstAmount',
                sgstAmount: '$$invTrn.sgstAmount',
                taxableAmount: '$$invTrn.taxableAmount',
                taxRate: '$$invTrn.tax.gstRatio.igst',
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          amount: { $sum: '$amount' },
          invTrns: { $push: '$invTrns' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          amount: 1,
          invTrns: 1,
        },
      },
      {
        $unwind: '$invTrns',
      },
      {
        $unwind: '$invTrns',
      },
      {
        $group: {
          _id: '$date',
          amount: { $first: '$amount' },
          invTrns: { $push: '$invTrns' },
        },
      },
      {
        $project: {
          _id: 0,
          // date: '$_id',
          date: { $toString: '$_id' },
          amount: 1,
          invTrns: 1,
        },
      },
    ]);
    cashSales = _.orderBy(cashSales, [x => x.date], ['asc']);
    // return cashSales;
    const cashSaleResult = [];
    for (const sale of cashSales) {
      const groupedTax = _.groupBy(sale.invTrns, x => x.taxRate);
      const dayRow = {
        Date: sale.date,
        Amount: sale.amount,
      };
      let gst0 = 0,
        cgst0 = 0,
        sgst0 = 0;
      const t0 = '0';
      if (groupedTax.hasOwnProperty(t0)) {
        cgst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst0 = roundValue(
          _.reduce(groupedTax[t0], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst01 = 0,
        cgst01 = 0,
        sgst01 = 0;
      const t01 = '0.1';
      if (groupedTax.hasOwnProperty(t01)) {
        cgst01 = roundValue(
          _.reduce(groupedTax[t01], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst01 = roundValue(
          _.reduce(groupedTax[t01], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst01 = roundValue(
          _.reduce(groupedTax[t01], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst025 = 0,
        cgst025 = 0,
        sgst025 = 0;
      const t025 = '0.25';
      if (groupedTax.hasOwnProperty(t025)) {
        cgst025 = roundValue(
          _.reduce(groupedTax[t025], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst025 = roundValue(
          _.reduce(groupedTax[t025], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst025 = roundValue(
          _.reduce(groupedTax[t025], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst1 = 0,
        cgst1 = 0,
        sgst1 = 0;
      const t1 = '1';
      if (groupedTax.hasOwnProperty(t1)) {
        cgst1 = roundValue(
          _.reduce(groupedTax[t1], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst1 = roundValue(
          _.reduce(groupedTax[t1], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst1 = roundValue(
          _.reduce(groupedTax[t1], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst1_5 = 0,
        cgst1_5 = 0,
        sgst1_5 = 0;
      const t1_5 = '1.5';
      if (groupedTax.hasOwnProperty(t1_5)) {
        cgst1_5 = roundValue(
          _.reduce(groupedTax[t1_5], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst1_5 = roundValue(
          _.reduce(groupedTax[t1_5], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst1_5 = roundValue(
          _.reduce(groupedTax[t1_5], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst3 = 0,
        cgst3 = 0,
        sgst3 = 0;
      const t3 = '3';
      if (groupedTax.hasOwnProperty(t3)) {
        cgst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst3 = roundValue(
          _.reduce(groupedTax[t3], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }
      let gst5 = 0,
        cgst5 = 0,
        sgst5 = 0;
      const t5 = '5';
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
      let gst7_5 = 0,
        cgst7_5 = 0,
        sgst7_5 = 0;
      const t7_5 = '7.5';
      if (groupedTax.hasOwnProperty(t7_5)) {
        cgst7_5 = roundValue(
          _.reduce(groupedTax[t7_5], (s, n) => s + n.cgstAmount, 0),
          2,
        );
        sgst7_5 = roundValue(
          _.reduce(groupedTax[t7_5], (s, n) => s + n.sgstAmount, 0),
          2,
        );
        gst7_5 = roundValue(
          _.reduce(groupedTax[t7_5], (s, n) => s + n.taxableAmount, 0),
          2,
        );
      }

      let gst12 = 0,
        cgst12 = 0,
        sgst12 = 0;
      const t12 = '12';
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
      const t18 = '18';
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
      const t28 = '28';
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
      const totalTaxableAmount =
        gst0 +
        gst01 +
        gst025 +
        gst1 +
        gst1_5 +
        gst3 +
        gst5 +
        gst7_5 +
        gst12 +
        gst18 +
        gst28;
      _.assign(dayRow, {
        TaxableAmt: roundValue(totalTaxableAmount, 2),
        // GST0: roundValue(gst0, 2),
        // GST01: roundValue(gst01, 2),
        // GST025: roundValue(gst025, 2),
        // GST1: roundValue(gst1, 2),
        // GST15: roundValue(gst1_5, 2),
        // GST3: roundValue(gst3, 2),
        // GST5: roundValue(gst5, 2),
        // GST75: roundValue(gst7_5, 2),
        // GST12: roundValue(gst12, 2),
        // GST18: roundValue(gst18, 2),
        // GST28: roundValue(gst28, 2),
        GST0: roundValue(sgst0 + cgst0, 2),
        GST01: roundValue(sgst01 + cgst01, 2),
        GST025: roundValue(sgst025 + cgst025, 2),
        GST1: roundValue(sgst1 + cgst1, 2),
        GST15: roundValue(sgst1_5 + cgst1_5, 2),
        GST3: roundValue(sgst3 + cgst3, 2),
        GST5: roundValue(sgst5 + cgst5, 2),
        GST75: roundValue(sgst7_5 + cgst7_5, 2),
        GST12: roundValue(sgst12 + cgst12, 2),
        GST18: roundValue(sgst18 + cgst18, 2),
        GST28: roundValue(sgst28 + cgst28, 2),
        // GST0: roundValue(gst0 + sgst0 + cgst0, 2),
        // GST01: roundValue(gst01 + sgst01 + cgst01, 2),
        // GST025: roundValue(gst025 + sgst025 + cgst025, 2),
        // GST1: roundValue(gst1 + sgst1 + cgst1, 2),
        // GST15: roundValue(gst1_5 + sgst1_5 + cgst1_5, 2),
        // GST3: roundValue(gst3 + sgst3 + cgst3, 2),
        // GST5: roundValue(gst5 + sgst5 + cgst5, 2),
        // GST75: roundValue(gst7_5 + sgst7_5 + cgst7_5, 2),
        // GST12: roundValue(gst12 + sgst12 + cgst12, 2),
        // GST18: roundValue(gst18 + sgst18 + cgst18, 2),
        // GST28: roundValue(gst28 + sgst28 + cgst28, 2),
      });
      cashSaleResult.push(dayRow);
      // return groupedTax;
    }
    // return _.orderBy(cashSaleResult, [x => x.date], ['asc']);
    // return _.orderBy(cashSaleResult, ['date'], ['asc']);
    return cashSaleResult;
  }

  async generateCashPdf(sales: any[], fromDate: string, toDate: string) {
    const tableContentRow = [];
    for (let i = 0; i < sales.length; i++) {
      tableContentRow.push([
        // { text: i + 1, style: 'tablerow', alignment: 'center' },
        { text: sales[i].Date, style: 'tablerow', alignment: 'left' },
        { text: sales[i].GST0, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST01, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST025, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST1, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST15, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST3, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST5, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST75, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST12, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST18, style: 'tablerow', alignment: 'right' },
        { text: sales[i].GST28, style: 'tablerow', alignment: 'right' },
        {
          text: sales[i].TaxableAmt,
          style: 'tablerow',
          alignment: 'right',
        },
        { text: sales[i].Amount, style: 'tablerow', alignment: 'right' },
      ]);
    }
    const docDef: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [15, 15, 15, 15],
      content: [
        { text: 'VELAVAN HYPER MARKET BOOKS & STATIONERY', style: 'headline' },
        {
          text: '45, GIN FACTORY ROAD, TUTICORIN - 628 002',
          style: 'sub_headline',
        },
        {
          text:
            'LANDLINE NO: - 0461 2383801, MOBILE NO:- 9842019102, 7373779102',
          style: 'sub_headline',
        },
        {
          columns: [
            {
              width: '2%',
              text: '',
            },
            {
              width: '*',
              text: 'Cash Sales Tax Report',
              bold: true,
            },
            {
              width: '15%',
              text: [{ text: 'From : ', bold: true }, { text: fromDate }],
            },
            {
              width: '12%',
              text: [{ text: 'To : ', bold: true }, { text: toDate }],
            },
          ],
          columnGap: 10,
          lineHeight: 1.4,
        },
        {
          layout: {
            paddingTop: i => (i === 0 ? 0 : 3),
            paddingBottom: i => (i === 0 ? 0 : 3),
          },
          table: {
            headerRows: 1,
            widths: [
              '9%',
              '6%',
              '5%',
              '5%',
              '5%',
              '5%',
              '6%',
              '6%',
              '5%',
              '7%',
              '7%',
              '5%',
              '7%',
              '7%',
            ],
            body: [
              [
                {
                  text: 'Date',
                  style: 'tableheading',
                  alignment: 'center',
                },
                { text: 'GST 0%', style: 'tableheading', alignment: 'right' },
                {
                  text: 'GST 0.1%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 0.25%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 1%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 1.5%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 3%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 5%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 7.5%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 12%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 18%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'GST 28%',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'Total Taxable Amount',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'NET Amount',
                  style: 'tableheading',
                  alignment: 'right',
                },
              ],
              ...tableContentRow,
            ],
          },
        },
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
        },
      },
    };
    return pdfMaker.createPdfKitDocument(docDef, {});
  }

  async generateCreditPdf(sales: any[], fromDate: string, toDate: string) {
    const tableContentRow = [];
    for (let i = 0; i < sales.length; i++) {
      tableContentRow.push([
        { text: i + 1, style: 'tablerow', alignment: 'center' },
        { text: sales[i].billDate, style: 'tablerow', alignment: 'left' },
        { text: sales[i].billNo, style: 'tablerow', alignment: 'left' },
        { text: sales[i].customerName, style: 'tablerow', alignment: 'left' },
        { text: sales[i].customerGSTNo, style: 'tablerow', alignment: 'left' },
        {
          text: sales[i].totalTaxableAmount,
          style: 'tablerow',
          alignment: 'right',
        },
        { text: sales[i].netAmount, style: 'tablerow', alignment: 'right' },
      ]);
    }
    const docDef: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [15, 15, 15, 15],
      content: [
        { text: 'VELAVAN HYPER MARKET BOOKS & STATIONERY', style: 'headline' },
        {
          text: '45, GIN FACTORY ROAD, TUTICORIN - 628 002',
          style: 'sub_headline',
        },
        {
          text:
            'LANDLINE NO: - 0461 2383801, MOBILE NO:- 9842019102, 7373779102',
          style: 'sub_headline',
        },
        {
          columns: [
            {
              width: '2%',
              text: '',
            },
            {
              width: '*',
              text: 'Credit Sales Tax Report',
              bold: true,
            },
            {
              width: '15%',
              text: [{ text: 'From : ', bold: true }, { text: fromDate }],
            },
            {
              width: '12%',
              text: [{ text: 'To : ', bold: true }, { text: toDate }],
            },
          ],
          columnGap: 10,
          lineHeight: 1.4,
        },
        {
          layout: {
            paddingTop: i => (i === 0 ? 0 : 3),
            paddingBottom: i => (i === 0 ? 0 : 3),
          },
          table: {
            headerRows: 1,
            widths: ['4%', '9%', '12%', '*', '15%', '10%', '10%'],
            body: [
              [
                { text: 'SlNo', style: 'tableheading', alignment: 'center' },
                {
                  text: 'Bill Date',
                  style: 'tableheading',
                  alignment: 'center',
                },
                { text: 'Bill No', style: 'tableheading', alignment: 'center' },
                {
                  text: 'Customer Name',
                  style: 'tableheading',
                  alignment: 'center',
                },
                {
                  text: 'Customer GSTNo',
                  style: 'tableheading',
                  alignment: 'left',
                },
                {
                  text: 'Total Taxable Amount',
                  style: 'tableheading',
                  alignment: 'right',
                },
                {
                  text: 'NET Amount',
                  style: 'tableheading',
                  alignment: 'right',
                },
              ],
              ...tableContentRow,
            ],
          },
        },
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
        },
      },
    };
    return pdfMaker.createPdfKitDocument(docDef, {});
  }
}
