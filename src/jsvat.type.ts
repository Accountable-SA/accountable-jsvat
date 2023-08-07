export interface Multipliers {
  readonly [key: string]: ReadonlyArray<number>;
}

export interface Rules {
  multipliers: Multipliers;
  check?: RegExp;
  regex: ReadonlyArray<RegExp>;
  lookup?: ReadonlyArray<number>;
  typeFormats?: { readonly [key: string]: RegExp };
  additional?: ReadonlyArray<RegExp>;
}

export type CountryConfig = {
  name: string;
  codes: readonly string[];
  rules: Rules;
} & (
  | { calcFn: (vat: string, options?: { readonly [key: string]: any }) => boolean }
  | { calcWithFormatFn: (vat: string, options?: { readonly [key: string]: any }) => { isValid: boolean; vat: string } }
);

export interface VatCheckResult {
  value?: string;
  isValid: boolean;
  isValidFormat: boolean;
  isSupportedCountry: boolean;
  country?: {
    name: string;
    isoCode: { short: string; long: string; numeric: string };
  };
}

export type Country =
  | 'andorra'
  | 'austria'
  | 'belgium'
  | 'brazil'
  | 'bulgaria'
  | 'croatia'
  | 'cyprus'
  | 'czechRepublic'
  | 'denmark'
  | 'estonia'
  | 'europe'
  | 'finland'
  | 'france'
  | 'germany'
  | 'greece'
  | 'hungary'
  | 'ireland'
  | 'italy'
  | 'latvia'
  | 'lithuania'
  | 'luxembourg'
  | 'malta'
  | 'netherlands'
  | 'norway'
  | 'poland'
  | 'portugal'
  | 'romania'
  | 'russia'
  | 'serbia'
  | 'slovakiaRepublic'
  | 'slovenia'
  | 'spain'
  | 'sweden'
  | 'switzerland'
  | 'unitedKingdom';
