/**
 * Global type definitions for browser APIs not yet fully supported in TypeScript
 */

// WeakRef support (ES2021 feature)
declare global {
  interface WeakRefConstructor {
    new <T extends object>(target: T): WeakRef<T>;
  }

  interface WeakRef<T extends object> {
    deref(): T | undefined;
  }

  var WeakRef: WeakRefConstructor | undefined;
}

export {};
