import { Document } from 'mongoose';

export interface M1CreditSale extends Document {
  date: Date;
  refNo: string;
  customer: { id: string, name: string, displayName: string };
  branch: { id: string, name: string, displayName: string };
  warehouse: { id: string, name: string, displayName: string };
  gstInfo: {
    source: {
      gstNo: string;
      regType: {id: string, name: string};
      location: {id: string, name: string};
    };
    destination: {
      gstNo: string;
      regType: {id: string, name: string};
      location: {id: string, name: string};
    };
  };
  description: string;
  customerPending: string;
  voucherNo: string;
  amount: number;
  discount: number;
  lut: boolean;
  taxInclusiveRate: boolean;
  invTrns: Array<{
    id: string;
    inventory: { id: string, name: string, displayName: string, bwd: boolean, hsnCode: string };
    batch: string;
    batchNo: string;
    hsnCode: string;
    serialNo: number;
    unit: { id: string, name: string, displayName: string, conversion: number };
    qty: number;
    rate: number;
    sRateTaxInc: boolean;
    mrp: number;
    discount: number;
    unitPrecision: number;
    tax: {
      id: string,
      name: string,
      displayName: string,
      gstRatio: {
        cgst: number,
        sgst: number,
        igst: number,
        cess: number,
      },
    };
    natureOfTrn: string;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    cessAmount: number;
    assetAmount: number;
    taxableAmount: number;
  }>;
  acTrns: Array<{
    account: { id: string, name: string, displayName: string, defaultName: string };
    credit: number;
    debit: number;
  }>;
  createdBy: string;
  updatedBy: string;
  approvedBy: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
}
