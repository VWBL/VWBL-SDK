module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testEnvironment: "node",
  testMatch: ['**/unit/**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules']
};
