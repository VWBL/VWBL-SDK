module.exports = {
  preset: "ts-jest/presets/js-with-babel-esm",
  testEnvironment: "node",
  testMatch: ['**/jest/*.test.ts'],
  transformIgnorePatterns: ['/node_modules']
};
