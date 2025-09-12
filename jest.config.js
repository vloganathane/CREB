export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/core/telemetry/__tests__/archived/',
    '/tests/e2e/'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/core/telemetry/__tests__/archived/**',
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      isolatedModules: true,
      tsconfig: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true
      }
    }]
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
