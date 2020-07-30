export const textFormatter = (obj: string): string => {
  if (typeof obj === 'string') {
    return (obj) ? obj.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
  }
  return '';
};


export const roundValue = ( data: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(data * factor) / factor;
};


