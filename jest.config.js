const commonCofig = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...commonCofig,
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
  coverageDirectory: './artifacts/coverage-jest/',
  collectCoverageFrom: [
    '**/(lib|src)/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
};
