import { InspectionData, ScopeItem } from './types';

/**
 * Email validation using RFC 5322 compliant regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate inspection data
 */
export function validateInspection(data: InspectionData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.clientName?.trim()) {
    errors.push('Client name is required');
  }

  if (!data.address?.trim()) {
    errors.push('Site address is required');
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email address format');
  }

  if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate quote data
 */
export function validateQuote(scopeItems: ScopeItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (scopeItems.length === 0) {
    errors.push('At least one scope item is required');
  }

  scopeItems.forEach((item, index) => {
    if (!item.category?.trim()) {
      errors.push(`Item ${index + 1}: Category is required`);
    }

    if (item.qty <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }

    if (item.labour < 0 || item.material < 0) {
      errors.push(`Item ${index + 1}: Costs cannot be negative`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email before sending
 */
export function validateEmailSend(email: string, recipientName: string): { valid: boolean; error?: string } {
  if (!email?.trim()) {
    return { valid: false, error: 'Email address is required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email address format' };
  }

  if (!recipientName?.trim()) {
    return { valid: false, error: 'Recipient name is required' };
  }

  return { valid: true };
}
