export function defined<T>(value: T | null | undefined, message?: string): T {
  if (!value) {
    throw new Error(message || "Value isn't defined");
  }

  return value;
}

export function isDefined<T>(value: T | undefined): value is T {
  return !!value;
}

export type Noop<T = void> = () => T;

export const noop: Noop<undefined> = () => undefined;

export type Optional<T> = T | null | undefined;

export type Nullable<T> = T | null;
