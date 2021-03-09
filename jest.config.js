// // eslint-disable-next-line import/no-extraneous-dependencies
// const path = require('path');

// const esModules = ['@folio'].join('|');

// module.exports = {
//   collectCoverageFrom: [
//     '**/(lib|src)/**/*.{js,jsx}',
//     '!**/node_modules/**',
//     '!**/test/**',
//   ],
//   coverageDirectory: './artifacts/coverage-jest/',
//   coverageReporters: ['lcov'],
//   reporters: ['jest-junit', 'default'],
//   transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './test/jest/jest-transformer.js') },
//   transformIgnorePatterns: [`/node_modules/(?!${esModules}|ky)`],
//   moduleNameMapper: {
//     '^.+\\.(css)$': 'identity-obj-proxy',
//     '^.+\\.(svg)$': 'identity-obj-proxy',
//   },
//   testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
//   testPathIgnorePatterns: ['/node_modules/'],
//   setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],
// };

const commonCofig = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...commonCofig,
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
  coverageDirectory: './artifacts/coverage/',
  collectCoverageFrom: [
    '**/SourceSearch/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
};
