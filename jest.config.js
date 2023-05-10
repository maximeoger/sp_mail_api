module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
}
