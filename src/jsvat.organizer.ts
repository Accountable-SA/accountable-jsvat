import fs from 'fs';
import path from 'path';
import { Country, CountryConfig } from './jsvat.type';

export function getCountriesMap(): Record<Country, CountryConfig> {
  // * read all files in current directory
  const countryFilesNames = fs.readdirSync(path.join(__dirname, 'countries'));
  const countriesToHandlerMap = {} as Record<Country, CountryConfig>;

  // * import all files and add them to the map
  for (const countryFileName of countryFilesNames) {
    const [countryName] = countryFileName.split('.');
    const countryFilePath = path.join(__dirname, 'countries', countryName);
    const countryFileData = require(countryFilePath);
    countriesToHandlerMap[countryName] = countryFileData[countryName];
  }

  return countriesToHandlerMap;
}
