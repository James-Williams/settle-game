const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  testURL: 'http://localhost:8080/',
  moduleFileExtensions: [
    'js',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/unit',
    '<rootDir>/test/e2e'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/src/'
  ],
  collectCoverageFrom: [
    '*.{js}',
    '!src/**/*',
    '!**/node_modules/**'
  ]
}
