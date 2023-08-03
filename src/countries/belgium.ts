import type { CountryConfig } from '../jsvat.type';

const isVatValid = (vat: string) => {
  const check = 97 - (Number(vat.slice(0, 8)) % 97);
  return check === Number(vat.slice(8, 10));
};

export const belgium: CountryConfig = {
  name: 'Belgium',
  codes: ['BE', 'BEL', '056'],
  calcWithFormatFn: (vat) => {
    if (vat.length !== 9) return { vat: 'BE' + vat, isValid: isVatValid(vat) };

    const vatWithPrefix0 = `0${vat}`;
    const isVatValidWithPrefix0 = isVatValid(vatWithPrefix0);
    if (isVatValidWithPrefix0) return { vat: 'BE' + vatWithPrefix0, isValid: true };

    const vatWithPrefix1 = `1${vat}`;
    const isVatValidWithPrefix1 = isVatValid(vatWithPrefix1);
    if (isVatValidWithPrefix1) return { vat: 'BE' + vatWithPrefix1, isValid: true };

    return { vat: 'BE' + vat, isValid: false };
  },
  rules: {
    multipliers: {},
    regex: [/^(BE)([0-1]?\d{9})$/],
  },
};
