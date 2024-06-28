module.exports = {
  preset: "ts-jest/presets/js-with-babel-esm",
  testEnvironment: "node",
  testMatch: ['**/unit/**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules']
};
