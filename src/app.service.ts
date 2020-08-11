import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as _ from 'lodash';
import { roundValue, textFormatter } from  './util';
import { M1CreditSale } from './model/m1-credit-sale.interface';

interface CreditSale {
  date: String,
}

@Injectable()
export class AppService {

  constructor( @InjectModel('M1CreditSale') private readonly creditSaleModel: Model<M1CreditSale> ){}

  async processM1CreditSale(from_date: string, to_date: string) {
    const sales = await this.creditSaleModel.find({date: {$gte: new Date(from_date), $lte: new Date(to_date)}});
    const result = [];
    for(const sale of sales) {
      const data = {
        date: moment(sale.date).format('DD/MM/YYYY'),
        customerName: sale.customer.displayName ? sale.customer.displayName : sale.customer.name,
        billNo: sale.voucherNo,
        customerGSTNO: sale.gstInfo?.destination?.gstNo ? sale.gstInfo.destination.gstNo : '',
        taxableAmount: sale.invTrns.taxableAmount,
      }
      const groupedTax = _.groupBy(sale.invTrns, x => (x.tax) ? x.tax.name : null);
      let gst5=0, cgst5=0, sgst5=0;
      const t5 = 'GST 5%'
      if (groupedTax.hasOwnProperty(t5)) {  
          cgst5= roundValue(_.reduce(groupedTax[t5], (s, n) => s + n.cgstAmount, 0), 2);
          sgst5= roundValue(_.reduce(groupedTax[t5], (s, n) => s + n.sgstAmount, 0), 2);
          gst5= roundValue(_.reduce(groupedTax[t5], (s, n) => s + n.taxableAmount, 0), 2);
      }
      _.assign(data, {gst5, cgst5, sgst5});
     
      let gst12=0, cgst12=0, sgst12=0;
      const t12 = 'GST 12%'
      if (groupedTax.hasOwnProperty(t12)) {  
          cgst12= roundValue(_.reduce(groupedTax[t12], (s, n) => s + n.cgstAmount, 0), 2);
          sgst12= roundValue(_.reduce(groupedTax[t12], (s, n) => s + n.sgstAmount, 0), 2);
          gst12= roundValue(_.reduce(groupedTax[t12], (s, n) => s + n.taxableAmount, 0), 2);
      }
      _.assign(data, {gst12, cgst12, sgst12});
      
      let gst18=0, cgst18=0, sgst18=0;
      const t18 = 'GST 18%'
      if (groupedTax.hasOwnProperty(t18)) {  
          cgst18= roundValue(_.reduce(groupedTax[t18], (s, n) => s + n.cgstAmount, 0), 2);
          sgst18= roundValue(_.reduce(groupedTax[t18], (s, n) => s + n.sgstAmount, 0), 2);
          gst18= roundValue(_.reduce(groupedTax[t18], (s, n) => s + n.taxableAmount, 0), 2);
      }
      _.assign(data, {gst18, cgst18, sgst18});
      
      let gst28=0, cgst28=0, sgst28=0;
      const t28 = 'GST 28%'
      if (groupedTax.hasOwnProperty(t28)) {  
          cgst28= roundValue(_.reduce(groupedTax[t28], (s, n) => s + n.cgstAmount, 0), 2);
          sgst28= roundValue(_.reduce(groupedTax[t28], (s, n) => s + n.sgstAmount, 0), 2);
          gst28= roundValue(_.reduce(groupedTax[t28], (s, n) => s + n.taxableAmount, 0), 2);
      }
      _.assign(data, {gst28, cgst28, sgst28});
      
      const total = (gst5+cgst5+sgst5+gst12+cgst12+sgst12+gst18+cgst18+sgst18+gst28+cgst28+sgst28);
      _.assign(data, {amount: roundValue(sale.amount, 2), total: roundValue(total, 2)});

      result.push(data);
    }
    return result;
  }
}


/*
      const records: any[] = [];
      for (const t in groupedTax) {
        if (groupedTax.hasOwnProperty(t) && t) {
          const tax = {
            ratio: t,
            cgst: _.reduce (groupedTax[t], (s, n) => s + n.cgstAmount, 0),
            sgst: _.reduce (groupedTax[t], (s, n) => s + n.sgstAmount, 0),
            value: _.reduce (groupedTax[t], (s, n) => s + n.taxableAmount, 0),
          };
          records.push(tax);
        }
      }
      _.assign(data, records);
      //=====================================================================
      let gst5=0, cgst5=0, sgst5=0;
      const t5 = 'GST 5%'
      if (groupedTax.hasOwnProperty(t5)) {  
          cgst5= _.reduce (groupedTax[t5], (s, n) => s + n.cgstAmount, 0);
          sgst5= _.reduce (groupedTax[t5], (s, n) => s + n.sgstAmount, 0);
          gst5= _.reduce (groupedTax[t5], (s, n) => s + n.taxableAmount, 0);
      }
      _.assign(data, {gst5, cgst5, sgst5});
      
      let gst12=0, cgst12=0, sgst12=0;
      const t12 = 'GST 12%'
      if (groupedTax.hasOwnProperty(t12)) {  
          cgst12= _.reduce (groupedTax[t12], (s, n) => s + n.cgstAmount, 0);
          sgst12= _.reduce (groupedTax[t12], (s, n) => s + n.sgstAmount, 0);
          gst12= _.reduce (groupedTax[t12], (s, n) => s + n.taxableAmount, 0);
      }
      _.assign(data, {gst12, cgst12, sgst12});
      
      let gst18=0, cgst18=0, sgst18=0;
      const t18 = 'GST 18%'
      if (groupedTax.hasOwnProperty(t18)) {  
          cgst18= _.reduce (groupedTax[t18], (s, n) => s + n.cgstAmount, 0);
          sgst18= _.reduce (groupedTax[t18], (s, n) => s + n.sgstAmount, 0);
          gst18= _.reduce (groupedTax[t18], (s, n) => s + n.taxableAmount, 0);
      }
      _.assign(data, {gst18, cgst18, sgst18});
      
      let gst28=0, cgst28=0, sgst28=0;
      const t28 = 'GST 28%'
      if (groupedTax.hasOwnProperty(t28)) {  
          cgst28= _.reduce (groupedTax[t28], (s, n) => s + n.cgstAmount, 0);
          sgst28= _.reduce (groupedTax[t28], (s, n) => s + n.sgstAmount, 0);
          gst28= _.reduce (groupedTax[t28], (s, n) => s + n.taxableAmount, 0);
      }
      _.assign(data, {gst28, cgst28, sgst28});

      result.push(data);

**/
