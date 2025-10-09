const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/app/layout.tsx',
    '!src/app/loading.tsx',
  ],
  coverageThreshold: {
    // Threshold específico para componentes críticos del Sprint 1
    './src/hooks/use-cart.ts': {
      branches: 87,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/hooks/use-menu.ts': {
      branches: 83,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/components/custom/dish-card.tsx': {
      branches: 66,
      functions: 66,
      lines: 81,
      statements: 83,
    },
    './src/app/(cliente)/carrito/page.tsx': {
      branches: 50,
      functions: 70,
      lines: 86,
      statements: 84,
    },
    './src/app/(cliente)/menu/page.tsx': {
      branches: 79,
      functions: 80,
      lines: 89,
      statements: 88,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|until-async|strict-event-emitter|@bundled-es-modules)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
