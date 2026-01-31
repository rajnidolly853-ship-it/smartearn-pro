/**
 * Validates Email Address
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Validates Indian Phone Number (10 digits)
 */
export const isValidPhone = (phone: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

/**
 * Validates UPI ID (vpa address)
 * Format: username@bank
 */
export const isValidUPI = (upi: string): boolean => {
  const re = /^[\w.-]+@[\w.-]+$/;
  return re.test(upi);
};

/**
 * Validates Paytm Number (same as phone)
 */
export const isValidPaytm = (number: string): boolean => {
  return isValidPhone(number);
};

/**
 * Validates Withdrawal Amount
 */
export const isValidWithdrawalAmount = (amount: number, min: number, max: number, balance: number): string | null => {
  if (!amount || amount <= 0) return 'Enter a valid amount';
  if (amount < min) return `Minimum withdrawal is ${min} coins`;
  if (amount > max) return `Maximum withdrawal is ${max} coins`;
  if (amount > balance) return 'Insufficient wallet balance';
  return null;
};
