import { Document } from 'mongoose';

export interface Sale extends Document {
  date: Date;
  fNo: number;
  refNo: string;
  customer: {
    id: string;
    name: string;
    displayName: string;
    customerGroup: string;
  };
  patient: { id: string; name: string; displayName: string };
  doctor: { id: string; name: string; displayName: string };
  branch: { id: string; name: string; displayName: string };
  warehouse: { id: string; name: string; displayName: string };
  gstInfo: {
    source: {
      gstNo: string;
      regType: { name: string; defaultName: string };
      location: { name: string; defaultName: string };
    };
    destination: {
      gstNo: string;
      regType: { name: string; defaultName: string };
      location: { name: string; defaultName: string };
    };
  };
  saleType: string;
  customerPending: string;
  cashRegister: { id: string; name: string; displayName: string };
  cashRegisterApproved: boolean;
  cashRegisterApprovedBy: string;
  description: string;
  voucherNo: string;
  voucherName: string;
  voucherType: string;
  cashAmount: number;
  eftAmount: number;
  bankAmount: number;
  creditAmount: number;
  amount: number;
  discount: number;
  lut: boolean;
  taxInclusiveRate: boolean;
  shippingInfo: {
    shipThrough: string;
    shippingDate: Date;
    trackingNo: string;
    deliveryAddress: {
      id: string;
      address: string;
      city: string;
      pincode: string;
      mobile: string;
      state: { name: string; defaultName: string; code: number };
      country: { name: string; defaultName: string };
    };
    shippingCharge: number;
    tax: {
      id: string;
      name: string;
      displayName: string;
    };
    taxAmount: {
      cgst: number;
      sgst: number;
      igst: number;
      cess: number;
    };
  };
  invTrns: Array<{
    id: string;
    inventory: {
      id: string;
      name: string;
      displayName: string;
      bwd: boolean;
      hsnCode: string;
    };
    batch: string;
    batchNo: string;
    hsnCode: string;
    serialNo: number;
    unit: { id: string; name: string; displayName: string; conversion: number };
    qty: number;
    rate: number;
    sRateTaxInc: boolean;
    mrp: number;
    expYear: number;
    expMonth: number;
    discount: number;
    unitPrecision: number;
    tax: {
      id: string;
      name: string;
      displayName: string;
      gstRatio: {
        cgst: number;
        sgst: number;
        igst: number;
        cess: number;
      };
    };
    natureOfTrn: string;
    assetAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    cessAmount: number;
    taxableAmount: number;
    sInc: string; // sales incharge
  }>;
  acTrns: Array<{
    account: {
      id: string;
      name: string;
      displayName: string;
      defaultName: string;
    };
    isAlt: boolean;
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
