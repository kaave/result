module.exports = {
  testURL: 'http://localhost',
  rootDir: 'src/',
  moduleFileExtensions: ['tsx', 'ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '\\.spec\\.(ts|tsx)$',
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/$1'
  }
};
