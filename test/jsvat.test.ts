import { countriesMap } from '../src/jsvat.organizer';
import { addCharsToString, checkInvalidVat, checkOnlyValidFormatVat, checkValidVat } from './jsvat.test-utils';
import { getCountriesFixturesMap } from './jsvat.test-utils';

const countriesFixturesMap = getCountriesFixturesMap();

for (const [countryName, { name, codes, valid, validOnlyByFormat, invalid }] of Object.entries(countriesFixturesMap)) {
  const countryData = countriesMap[countryName];

  describe(countryName, () => {
    test('should return "true" result for valid VATs', () => {
      valid.forEach((vat) => checkValidVat(vat, [countryData], codes, name));
    });

    test('should return "true" for "isSupportedCountry" and "isValidFormat" fields, but "false" for "isValid" for VATs that match format but still invalid', () => {
      validOnlyByFormat.forEach((vat) => checkOnlyValidFormatVat(vat, [countryData]));
    });

    test('should return "true" result for valid VATs with extra dash characters', () => {
      valid.map((vat) => addCharsToString(vat, '-')).forEach((vat) => checkValidVat(vat, [countryData], codes, name));
    });

    test('should return "true" result for valid VATs with extra space characters', () => {
      valid.map((vat) => addCharsToString(vat, ' ')).forEach((vat) => checkValidVat(vat, [countryData], codes, name));
    });

    test('should return "false" result for invalid VATs', () => {
      invalid.forEach((vat) => checkInvalidVat(vat, [countryData]));
    });
  });
}
