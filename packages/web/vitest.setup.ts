import '@testing-library/jest-dom/vitest';

import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [0];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, 'requestAnimationFrame', {
  writable: true,
  value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16),
});

Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  writable: true,
  value: (id: number) => window.clearTimeout(id),
});
