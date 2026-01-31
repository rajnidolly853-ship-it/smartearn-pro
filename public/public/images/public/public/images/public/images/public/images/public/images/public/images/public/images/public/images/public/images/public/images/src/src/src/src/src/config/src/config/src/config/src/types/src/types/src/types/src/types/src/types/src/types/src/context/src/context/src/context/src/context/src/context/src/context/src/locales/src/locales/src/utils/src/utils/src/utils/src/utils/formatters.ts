import { APP_CONFIG } from '../config/app.config';

/**
 * Formats number with commas (e.g., 1,000,000)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Converts coins to currency string (e.g., ₹10.50)
 */
export const formatCurrency = (coins: number): string => {
  const value = coins / APP_CONFIG.CURRENCY.COIN_RATE;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats time duration (seconds to MM:SS)
 */
export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Masks email (e.g., jo***@gmail.com) for privacy
 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name}***@${domain}`;
  return `${name.substring(0, 2)}***@${domain}`;
};
