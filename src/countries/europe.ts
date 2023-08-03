import { CountryConfig } from '../jsvat.type';

export const europe: CountryConfig = {
  name: 'Europe',
  codes: ['EU', 'EUR', '000'], // TODO (S.Panfilov) that's not a real codes
  calcFn: (): boolean => {
    // We know little about EU numbers apart from the fact that the first 3 digits represent the
    // country, and that there are nine digits in total.
    return true;
  },
  rules: {
    multipliers: {},
    regex: [/^(EU)(\d{9})$/],
  },
};
