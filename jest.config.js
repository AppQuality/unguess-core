// jest.config.js
const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/features/db/*",
    "!<rootDir>/src/features/sqlite/*",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/config.ts",
    "!<rootDir>/src/middleware/postResponseHandler.ts",
  ],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFiles: ["<rootDir>/src/__mocks__/mocks.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__mocks__/globalSetup.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
