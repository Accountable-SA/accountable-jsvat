/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  transform: {
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  testMatch: ['**/*?(*.)+(spec|test).[jt]s?(x)'],
};

export default config;
