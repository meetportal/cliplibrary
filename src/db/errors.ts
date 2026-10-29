const UNIQUE_VIOLATION = '23505';

const codeOf = (error: unknown): unknown =>
  typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;

export const isUniqueViolation = (error: unknown): boolean =>
  codeOf(error) === UNIQUE_VIOLATION ||
  (error instanceof Error && codeOf(error.cause) === UNIQUE_VIOLATION);
