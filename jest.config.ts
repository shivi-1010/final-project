import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@entity/(.*)$': '<rootDir>/src/entity/$1',
    '^@repository/(.*)$': '<rootDir>/src/repository/$1',
  },
};

export default config;
