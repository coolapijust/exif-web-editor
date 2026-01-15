export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateTag(name: string, _value: unknown): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Invalid tag name' }
  }
  return { valid: true }
}
