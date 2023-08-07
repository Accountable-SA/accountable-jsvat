import { checkVAT } from '../src/jsvat.index';
import type { Country, CountryConfig } from '../src/jsvat.type';
import fs from 'fs';
import path from 'path';

export function checkValidVat(vat: string, countriesList: CountryConfig[], codes, name) {
  const result = checkVAT(vat, countriesList);

  // if (!result.isValid) console.info('Invalid VAT:', vat);

  expect(result.isValid).toBe(true);
  expect(result.isSupportedCountry).toBe(true);
  expect(result.isValidFormat).toBe(true);
  expect(result.country?.name).toBe(name);
  expect(result.country?.isoCode.short).toBe(codes[0]);
  expect(result.country?.isoCode.long).toBe(codes[1]);
  expect(result.country?.isoCode.numeric).toBe(codes[2]);
}

export function checkInvalidVat(vat: string, countriesList: CountryConfig[]) {
  const result = checkVAT(vat, countriesList);
  // if (result.isValid) console.info('Following VAT should be invalid:', vat);
  expect(result.isValid).toBe(false);
}

export function checkOnlyValidFormatVat(vat: string, countriesList: CountryConfig[]) {
  const result = checkVAT(vat, countriesList);

  // if (!result.isValid) console.info('Invalid VAT:', vat);

  expect(result.isValid).toBe(false);
  expect(result.isSupportedCountry).toBe(true);
  expect(result.isValidFormat).toBe(true);
}

export function addCharsToString(item, char) {
  const val = item.split('');
  val.splice(3, 0, char);
  val.splice(7, 0, char);
  return val.join('');
}

export function getCountriesFixturesMap() {
  // * read all files in current directory
  const countryFixtureFilesNames = fs.readdirSync(path.join(__dirname, 'countries-fixtures'));
  const countriesToHandlerMap = {} as Record<
    Country,
    {
      name: string;
      codes: string[];
      valid: string[];
      validOnlyByFormat: string[];
      invalid: string[];
    }
  >;

  // * import all files and add them to the map
  for (const countryFixtureFileName of countryFixtureFilesNames) {
    const [countryName] = countryFixtureFileName.split('.');
    const countryFixtureFilePath = path.join(__dirname, 'countries-fixtures', `${countryName}.fixture`);
    const countryFixtureFileData = require(countryFixtureFilePath);
    countriesToHandlerMap[countryName] = countryFixtureFileData;
  }

  return countriesToHandlerMap;
}
