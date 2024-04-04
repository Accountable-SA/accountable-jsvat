import { CountryConfig } from '../jsvat.type';

export const cyprus: CountryConfig = {
  name: 'Cyprus',
  codes: ['CY', 'CYP', '196'],
  calcFn: (vat: string): boolean => {
    // Not allowed to start with '12'
    if (Number(vat.slice(0, 2)) === 12) return false;

    // Extract the next digit and multiply by the counter.
    let total: string | number = extractAndMultiplyByCounter(vat, 0);

    // Establish check digit using modulus 26, and translate to char. equivalent.
    total = total % 26;
    total = String.fromCharCode(total + 65);

    // Check to see if the check digit given is correct
    const expect = vat.substr(8, 1);
    return total === expect;
  },
  rules: {
    multipliers: {},
    regex: [/^(CY)(\d{8}[A-Z])$/],
  },
};

function extractAndMultiplyByCounter(vat: string, total: number): number {
  let result = total;
  for (let i = 0; i < 8; i++) {
    let temp = Number(vat.charAt(i));
    if (i % 2 === 0) {
      switch (temp) {
        case 0:
          temp = 1;
          break;
        case 1:
          temp = 0;
          break;
        case 2:
          temp = 5;
          break;
        case 3:
          temp = 7;
          break;
        case 4:
          temp = 9;
          break;
        default:
          temp = temp * 2 + 3;
      }
    }
    result += temp;
  }

  return result;
}
