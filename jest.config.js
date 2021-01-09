module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-localstorage-mock"],
  coverageDirectory: "./coverage/",
  collectCoverage: true,
};
