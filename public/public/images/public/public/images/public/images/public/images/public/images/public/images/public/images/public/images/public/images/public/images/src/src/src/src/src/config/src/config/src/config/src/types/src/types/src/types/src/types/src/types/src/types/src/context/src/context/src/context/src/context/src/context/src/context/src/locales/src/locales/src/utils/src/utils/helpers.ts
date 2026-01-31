import { format, isToday, isYesterday } from 'date-fns';

/**
 * Delays execution for specified milliseconds
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Checks if a date string/timestamp is today
 */
export const checkIsToday = (date: number | string | Date) => {
  return isToday(new Date(date));
};

/**
 * Checks if a date string/timestamp was yesterday
 */
export const checkIsYesterday = (date: number | string | Date) => {
  return isYesterday(new Date(date));
};

/**
 * Formats timestamp to readable date
 * @param timestamp 
 * @param formatStr (default: 'dd MMM yyyy, hh:mm a')
 */
export const formatDate = (timestamp: number, formatStr: string = 'dd MMM yyyy, hh:mm a') => {
  if (!timestamp) return '-';
  return format(new Date(timestamp), formatStr);
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Truncates string if too long
 */
export const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};
