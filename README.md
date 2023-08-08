<h1><p align="center">@accountable/jsvat</p></h1>

<p align="center">Check the validity of the format of a VAT number. No dependencies</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@accountable/jsvat">
    <img src="https://img.shields.io/npm/v/@accountable/jsvat.svg?style=flat-square&amp;logo=npm" alt="npm">
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
  <a href="https://github.com/@accountable/jsvat/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="GitHub license">
  </a>
</p>

## Disclaimer

This library is a fork of [jsvat](https://github.com/se-panfilov/jsvat) which in no longer maintained and all new pull requests to it are ignored for long time.

So in [Accountable](https://www.accountable.eu/), we thought it would be great to add support for the new VAT number format and keep the library up to date and easily maintained as it is part of our day to day work.

## What is it?

Small library to check validity VAT numbers (European + some others counties). ([learn more][1] about VAT)

- Rewritten into Typescript :new:
- No dependencies
- No http calls
- 2-step checks: math + regexp
- Tree-shakeable
- Extendable
- Separate checks for valid VAT and valid VAT format
- Dynamically add/remove countries with which you want to check the VAT
- Detecting possible country before you finish
- Typescript

## Installation

via **npm**:

```bash
npm i @accountable/jsvat
```

via **yarn**:

```bash
yarn add @accountable/jsvat
```

## Getting Started

- check against specific countries

```javascript
import { checkVAT, belgium, austria } from '@accountable/jsvat';

checkVAT('BE0411905847', [belgium]); // true: accept only Belgium VATs
checkVAT('BE0411905847', [belgium, austria]); // true: accept only Belgium or Austria VATs
checkVAT('BE0411905847', [austria]); // false: accept only Austria VATs
```

- check against all supported countries

```javascript
import { checkVAT } from '@accountable/jsvat';

checkVAT('BE0411905847'); // no need to pass countries as all supported countries will be used as default behavior
```

- check against all supported countries except specific ones

```javascript
import { checkVAT, countries } from '@accountable/jsvat';

const { france, germany, ...countriesToValidate } = countries;

checkVAT('BE0411905847', countriesToValidate);
```

## Return value

`checkVAT()` returns `VatCheckResult` object:

```typescript
export interface VatCheckResult {
  value?: string; // 'BE0411905847': your VAT without extra characters (like '-', spaces, etc)
  isValid: boolean; // The main result. Indicates if VAT is correct against provided countries or not
  isValidFormat: boolean; // Indicates the validation of the format of VAT only. E.g. "BE0411905847" is a valid VAT, and "BE0897221791" is not. But they both has valid format, so "isValidFormat" will return "true"
  isSupportedCountry: boolean; // Indicates if "jsvat" could recognize the VAT. Sometimes you want to understand - if it's an invalid VAT from supported country or from an unknown one
  country?: {
    // VAT's country (null if not found). By "supported" I mean imported.
    name: string; // ISO country name of VAT
    isoCode: {
      // Country ISO codes
      short: string;
      long: string;
      numeric: string;
    };
  };
}
```

## List of supported Countries:

- 🇦🇩 Andorra
- 🇦🇹 Austria
- 🇧🇪 Belgium
- 🇧🇷 Brazil
- 🇧🇬 Bulgaria
- 🇭🇷 Croatia
- 🇨🇾 Cyprus
- 🇨🇿 Czech republic
- 🇩🇰 Denmark
- 🇪🇪 Estonia
- 🇪🇺 Europe
- 🇫🇮 Finland
- 🇫🇷 France
- 🇩🇪 Germany
- 🇬🇷 Greece
- 🇭🇺 Hungary
- 🇮🇪 Ireland
- 🇮🇹 Italy
- 🇱🇻 Latvia
- 🇱🇹 Lithuania
- 🇱🇺 Luxembourg
- 🇲🇹 Malta
- 🇳🇱 Netherlands
- 🇳🇴 Norway
- 🇵🇱 Poland
- 🇵🇹 Portugal
- 🇷🇴 Romania
- 🇷🇺 Russia
- 🇷🇸 Serbia
- 🇸🇰 Slovakia Republic
- 🇸🇮 Slovenia
- 🇪🇸 Spain
- 🇸🇪 Sweden
- 🇬🇧 United Kingdom
- 🇨🇭 Switzerland

## Extend countries list - add your own country

You can add your own country.
In general `Country` should implement following structure:

```typescript
interface Country {
  name: string;
  codes: ReadonlyArray<string>;
  rules: {
    multipliers: {}; // you can leave it empty
    regex: ReadonlyArray<RegExp>;
  };
} & ({
    calcFn: (vat: string, options?: object) => boolean; // use this if you want to check only format of VAT
  } | {
    calcWithFormatFn: (vat: string, options?: object) => {isValid: boolean, vat: string}; // use this if you want to check format of VAT and re-format it
  })
```

Example:

```javascript
import { checkVAT } from '@accountable/jsvat';

export const wonderland = {
  name: 'Wonderland',
  codes: ['WD', 'WDR', '999'], // This codes should follow ISO standards (short, long and numeric), but it's your own business
  calcFn: (vat) => {
    return vat.length === 10;
  },
  rules: {
    regex: [/^(WD)(\d{8})$/],
  },
};

checkVAT('WD12345678', [wonderland]); // true
```

## About modules... ES6 / CommonJS

jsvat build includes `es6`, `commonjs`, `amd`, `umd` and `system` builds at the same time.

By default you will stick to `es6` version for browsers and build tools (webpack, etc):
which expects you to import it as

```javascript
import { checkVAT, belgium, austria } from '@accountable/jsvat';
```

Node.js automatically will pick up `CommonJS` version by default.
Means you could import it like:

```jsx harmony
// Modern Frontend and Node
const { checkVAT, belgium, austria } = require('@accountable/jsvat');

// Node.js
const { checkVAT, belgium, austria } = require('@accountable/jsvat');

// Legacy Frontend
<script src='whatever/jsvat/lib/umd/index.js'></script>;
```

Alternatively you can specify which module system you do want, e.g.:

```jsx harmony
// CommonJS (i.g nodejs)
const { checkVAT, belgium, austria } = require('jsvat/lib/commonjs');

// ES6
import { checkVAT, belgium, austria } from 'jsvat/lib/es6';
```

## How `@accountable/jsvat` checks validity?

There is 2-step check:

1. Compare with list of Regexps;

For example regexp for austria is `/^(AT)U(\d{8})$/`.

Looks like `ATU99999999` is valid (it's satisfy the regexp), but actually it's should be invalid.

2. Some magic mathematical counting;

Here we make some mathematical calculation (different for each country).
After that we may be sure that `ATU99999999`and for example `ATV66889218` isn't valid, but `ATU12011204` is valid.

**Note:** VAT numbers of some countries should ends up with special characters. Like '01' for Sweden or "L" for Cyprus. If 100% real VAT doesn't fit, try to add proper appendix.

[1]: https://en.wikipedia.org/wiki/VAT_identification_number
