export function validateType(value: unknown, expectedType: string): boolean {
  return typeof value === expectedType
}
