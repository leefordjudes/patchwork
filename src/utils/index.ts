import dayjs from 'dayjs';
import { isISO8601, isMongoId } from 'class-validator';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { TransformFnParams } from 'class-transformer';


export const textFormatter = (obj: string): string => {
  if (typeof obj === 'string') {
    return obj ? obj.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
  }
  return '';
};

export const validateTransactionDates = (dates: string[], startDate: any) => {
  for (const date of dates) {
    if (!isISO8601(date) || new Date(startDate).getTime() > new Date(date).getTime()) {
      return false;
    }
  }
  return true;
};

export const crossValidateCondition2 = (data: any, keys: string[]) => {
  const condition = [];

  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    if (data[keys[i]]) {
      for (const key of keys) {
        const obj: any = {};
        obj[key] = data[keys[i]];
        condition.push(obj);
      }
    }
  }
  return condition;
};

export const formatDateToString = (date: Date) => dayjs(new Date(date)).format('YYYY-MM-DD');

export const round = (value: number) => Math.round(value * 100) / 100;

export const roundValue = (data: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(data * factor) / factor;
};

export const IsValidJSONString = (data: any) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

export const evenRound = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  const value = +(num * factor).toFixed(8);
  const reminder = value - Math.floor(value);
  // If reminder is .5, check the roundedValue is odd or even when roundedValue is odd add .1
  const res =
    reminder === 0.5 ? (Math.floor(value) % 2 === 0 ? Math.floor(value) : Math.floor(value) + 1) : Math.round(value);
  return precision ? res / factor : res;
};

export const unitConversions = (inventory: any) => {
  return inventory.allUnitConversion.map((x: any) => ({
    id: x.unit.id,
    conversion: x.conversion,
    name: x.unit.name,
    displayName: x.unit.displayName,
    primary: x.primary,
  }));
};

export const toNotNull = (params: TransformFnParams) => {
  return params.value === null ? undefined : params.value;
};

export const toValArray = (params: TransformFnParams) => {
  return params.value.length === 0 ? undefined : params.value;
};

export const toObjectId = (params: TransformFnParams) => {
  return isMongoId(params.value) ? Types.ObjectId(params.value) : undefined;
};

export const toValString = (params: TransformFnParams) => {
  if (params.key === 'batchNo') {
    return typeof params.value === 'string' && params.value.length > 0 && params.value !== ''
      ? params.value.toUpperCase()
      : undefined;
  }
  return typeof params.value === 'string' && params.value.length > 0 && params.value !== '' ? params.value : undefined;
};

export const toDate =
  (opt: { tz?: boolean } = { tz: false }) =>
  (params: TransformFnParams) => {
    if (isISO8601(params.value)) {
      const date = new Date(params.value);
      return opt.tz ? date : date.setUTCHours(0, 0, 0, 0);
    }
    return undefined;
  };

export const toMinObj = (params: TransformFnParams) => {
  return _.isEmpty(_.omitBy(params.value, (x) => x === undefined)) ? undefined : params.value;
};

export const jsonParse = (mock: any) => {
  try {
    return JSON.parse(mock);
  } catch (ex) {
    return false;
  }
};
