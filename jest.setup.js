// Polyfill for TextEncoder/TextDecoder (required by MSW) - MUST BE FIRST
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for fetch API (required by MSW) using whatwg-fetch
require('whatwg-fetch')

// Mock BroadcastChannel (required by MSW)
global.BroadcastChannel = class BroadcastChannel {
  constructor() {}
  postMessage() {}
  close() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Silenciar warnings específicos que no afectan los tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Silenciar warning de act(...) - es manejado por Testing Library internamente
    if (
      typeof args[0] === 'string' &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    // Silenciar warning de jsdom navigation - limitación conocida
    if (
      args[0]?.type === 'not implemented' ||
      (typeof args[0] === 'string' && args[0].includes('Not implemented: navigation'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    // Silenciar otros warnings no críticos si es necesario
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('act(') || args[0].includes('navigation'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
