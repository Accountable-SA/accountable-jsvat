import { CountryConfig, VatCheckResult } from './jsvat.type';
import { getCountriesMap } from './jsvat.organizer';

const countriesMap = getCountriesMap();

/*
 * This is a copy of the original jsvat package, but with the following changes:
 * 1. Added modified Belgium and Germany to the list of countries so that they can be maintained by us for any change in the future.
 * 2. We used proxy pattern to just add the new countries to the list of countries, and keep the rest of the countries handles by the original jsvat package.
 */

function makeResult(vat: string, isValid: boolean, country?: CountryConfig) {
  return {
    value: vat || undefined,
    isValid: Boolean(isValid),
    isValidFormat: country ? isVatValidToRegexp(vat, country.rules.regex).isValid : false,
    isSupportedCountry: Boolean(country),
    country: !country
      ? undefined
      : {
          name: country.name,
          isoCode: {
            short: country.codes[0],
            long: country.codes[1],
            numeric: country.codes[2],
          },
        },
  };
}

function removeExtraChars(vat: string = '') {
  return vat
    .toString()
    .toUpperCase()
    .replace(/(\s|-|\.|\/)+/g, '');
}

function getCountryCodes(country: CountryConfig): ReadonlyArray<string> {
  return [...country.codes, country.name === 'Greece' ? 'EL' : undefined].filter(Boolean) as ReadonlyArray<string>;
}

const countriesVATDoesNotStartWithCountryCode: ReadonlyArray<string> = [countriesMap.brazil.name];

function isVATStartWithCountryCode(countryName: string): boolean {
  return !countriesVATDoesNotStartWithCountryCode.includes(countryName);
}

function isVATStartWithNumber(vat: string): boolean {
  return !!vat.match(/^\d{2}/);
}

function getCountry(vat: string, countriesList: ReadonlyArray<CountryConfig>): CountryConfig | undefined {
  for (const country of countriesList) {
    if (startsWithCode(vat, country) || (!isVATStartWithCountryCode(country.name) && isVATStartWithNumber(vat)))
      return country;
  }
  return undefined;
}

function startsWithCode(vat: string, country: CountryConfig): boolean {
  const countryCodes = getCountryCodes(country);
  return countryCodes.filter((code) => vat.startsWith(code)).length > 0;
}

function isVatValidToRegexp(vat: string, regexArr: ReadonlyArray<RegExp>): { isValid: boolean; regex?: RegExp } {
  for (const regex of regexArr) {
    const isValid = regex.test(vat);
    if (isValid) return { isValid: true, regex: regex };
  }

  return { isValid: false, regex: undefined };
}

function isVatValid(vat: string, country: CountryConfig) {
  const regexpValidRes = isVatValidToRegexp(vat, country.rules.regex);
  if (!regexpValidRes.isValid || !regexpValidRes.regex) return false;
  const regexResult = regexpValidRes.regex.exec(vat);
  if (!regexResult) return false;
  return 'calcWithFormatFn' in country ? country.calcWithFormatFn(regexResult[2]) : country.calcFn(regexResult[2]);
}

export const countries = Object.values(countriesMap);

export function checkVAT(vat: string, countriesList: ReadonlyArray<CountryConfig> = countries): VatCheckResult {
  if (!vat) return makeResult(vat, false);
  const cleanVAT = removeExtraChars(vat);
  const country = getCountry(cleanVAT, countriesList);

  const validityData = country ? isVatValid(cleanVAT, country) : false;

  const { isValid, finalVat } =
    typeof validityData === 'boolean'
      ? { isValid: validityData, finalVat: cleanVAT }
      : {
          isValid: validityData.isValid,
          finalVat: validityData.vat,
        };

  return makeResult(finalVat, isValid, country);
}
