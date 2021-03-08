import { Schema } from 'mongoose';
import { roundValue } from '../util';

export const saleSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    fNo: {
      type: Number,
    },
    refNo: {
      type: String,
      maxlength: 50,
    },
    customer: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
        customerGroup: { type: String },
      },
    },
    patient: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
      },
    },
    doctor: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
      },
    },
    branch: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
      },
      required: true,
    },
    warehouse: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
      },
      required: false,
    },
    gstInfo: {
      destination: {
        type: {
          regType: {
            type: {
              name: String,
              defaultName: String,
            },
          },
          gstNo: {
            type: String,
            maxlength: 15,
            minlength: 15,
          },
          location: {
            type: {
              name: String,
              defaultName: String,
            },
          },
        },
      },
      source: {
        type: {
          regType: {
            type: {
              name: String,
              defaultName: String,
            },
          },
          gstNo: {
            type: String,
            maxlength: 15,
            minlength: 15,
          },
          location: {
            type: {
              name: String,
              defaultName: String,
            },
          },
        },
      },
    },
    saleType: {
      type: String,
      index: true,
    },
    customerPending: {
      type: String,
      index: true,
    },
    cashRegister: {
      type: {
        id: { type: String },
        name: { type: String },
        displayName: { type: String },
      },
    },
    cashRegisterApproved: {
      type: Boolean,
      default: false,
    },
    cashRegisterApprovedBy: {
      type: String,
      ref: 'User',
    },
    description: {
      type: String,
      maxlength: 200,
    },
    voucherNo: {
      type: String,
      required: true,
      maxlength: 50,
      index: true,
    },
    voucherName: {
      type: String,
      index: true,
    },
    voucherType: {
      type: String,
    },
    cashAmount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    eftAmount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    bankAmount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    creditAmount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    amount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    discount: {
      type: Number,
      set: x => roundValue(x, 2),
      default: 0,
    },
    lut: {
      type: Boolean,
      default: false,
    },
    taxInclusiveRate: {
      type: Boolean,
      default: true,
    },
    shippingInfo: {
      type: {
        shipThrough: String,
        shippingDate: Date,
        trackingNo: String,
        deliveryAddress: {
          type: {
            id: String,
            address: String,
            city: String,
            pincode: String,
            mobile: String,
            state: {
              type: {
                name: String,
                defaultName: String,
                code: Number,
              },
            },
            country: {
              type: {
                name: String,
                defaultName: String,
              },
            },
          },
        },
        shippingCharge: Number,
        tax: {
          type: {
            id: String,
            name: String,
            displayName: String,
          },
        },
        taxAmount: {
          type: {
            cgst: { type: Number, set: x => roundValue(x, 2) },
            sgst: { type: Number, set: x => roundValue(x, 2) },
            igst: { type: Number, set: x => roundValue(x, 2) },
            cess: { type: Number, set: x => roundValue(x, 2) },
          },
        },
      },
    },
    invTrns: [
      {
        inventory: {
          type: {
            id: String,
            name: String,
            displayName: String,
            bwd: Boolean,
          },
          required: true,
        },
        expYear: Number,
        expMonth: Number,
        batch: String,
        batchNo: String,
        hsnCode: String,
        serialNo: Number,
        unit: {
          id: String,
          name: String,
          displayName: String,
          conversion: Number,
        },
        qty: Number,
        rate: { type: Number, set: x => roundValue(x, 2) },
        sRateTaxInc: Boolean,
        mrp: { type: Number, set: x => roundValue(x, 2) },
        discount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        unitPrecision: Number,
        tax: {
          type: {
            id: String,
            name: String,
            displayName: String,
            gstRatio: {
              cgst: Number,
              sgst: Number,
              igst: Number,
              cess: Number,
            },
          },
        },
        natureOfTrn: String,
        cgstAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        sgstAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        igstAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        cessAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        taxableAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        assetAmount: {
          type: Number,
          set: x => roundValue(x, 2),
          default: 0,
        },
        // sales incharge
        sInc: {
          type: String,
          ref: 'SalesPeople',
        },
      },
    ],
    acTrns: [
      {
        account: {
          type: {
            id: String,
            name: String,
            displayName: String,
            defaultName: String,
          },
          required: true,
        },
        isAlt: Boolean,
        credit: {
          type: Number,
          set: x => roundValue(x, 2),
        },
        debit: {
          type: Number,
          set: x => roundValue(x, 2),
        },
      },
    ],
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: String,
      ref: 'User',
    },
    approvedBy: {
      type: String,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)
  .index({ updatedAt: 1 })
  .index({ 'branch.id': 1 });
