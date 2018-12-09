module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  modulePathIgnorePatterns: ['dist'],
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  // testMatch: ['<rootDir>/src/*/bitbank/**/*.spec.ts'],
  // "testRegex": "/src/.*binance.*\\.(test|spec).(ts)$",
  testURL: 'http://localhost/',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**', '!**/vendor/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'lcov'],
  verbose: true,
};
