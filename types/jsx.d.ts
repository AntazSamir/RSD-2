// Type definitions for React 19 JSX compatibility
import * as React from 'react';

// Extend the React types to handle React 19 compatibility issues
declare module 'react' {
  // Make ReactNode more permissive to handle Element types
  type ReactNode = ReactElement | string | number | boolean | null | undefined;
}

export {};