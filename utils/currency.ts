import { Settings } from '@/contexts/SettingsContext';

export interface CurrencyFormatOptions {
  currency?: string;
  symbol?: string;
  showSymbol?: boolean;
  decimals?: number;
}

/**
 * Format a number as currency using the app settings
 */
export const formatCurrency = (
  amount: number,
  settings: Settings,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    currency = settings.currency,
    symbol = settings.currencySymbol,
    showSymbol = true,
    decimals = 2
  } = options;

  // Handle different currency formatting rules
  const formattedAmount = formatNumber(amount, currency, decimals);

  if (!showSymbol) {
    return formattedAmount;
  }

  // For Indian Rupee, symbol typically comes before the amount
  // For other currencies, follow their conventions
  switch (currency) {
    case 'INR':
      return `${symbol}${formattedAmount}`;
    case 'USD':
    case 'EUR':
    case 'GBP':
      return `${symbol}${formattedAmount}`;
    case 'JPY':
      return `${symbol}${Math.round(amount).toLocaleString()}`; // JPY doesn't use decimals
    default:
      return `${symbol}${formattedAmount}`;
  }
};

/**
 * Format a number according to currency rules
 */
const formatNumber = (amount: number, currency: string, decimals: number): string => {
  switch (currency) {
    case 'INR':
      // Indian numbering system (lakhs, crores)
      return formatIndianNumber(amount, decimals);
    case 'JPY':
      // Japanese Yen doesn't use decimal places
      return Math.round(amount).toLocaleString();
    default:
      // Standard formatting for other currencies
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
  }
};

/**
 * Format number in Indian numbering system
 */
const formatIndianNumber = (amount: number, decimals: number): string => {
  const parts = amount.toFixed(decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add commas in Indian style (last 3 digits, then groups of 2)
  let formatted = '';
  const len = integerPart.length;

  if (len <= 3) {
    formatted = integerPart;
  } else {
    // First group of 3 from right
    formatted = integerPart.slice(-3);
    let remaining = integerPart.slice(0, -3);

    // Add groups of 2 from right to left
    while (remaining.length > 0) {
      if (remaining.length <= 2) {
        formatted = remaining + ',' + formatted;
        break;
      } else {
        formatted = remaining.slice(-2) + ',' + formatted;
        remaining = remaining.slice(0, -2);
      }
    }
  }

  return decimals > 0 ? `${formatted}.${decimalPart}` : formatted;
};

/**
 * Parse a currency string back to a number
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove all non-digit and non-decimal characters
  const cleanString = currencyString.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get currency symbol for a currency code
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
  };
  return symbols[currency] || '₹';
};

/**
 * Get currency name for display
 */
export const getCurrencyName = (currency: string): string => {
  const names: Record<string, string> = {
    'INR': 'Indian Rupee',
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
  };
  return names[currency] || 'Indian Rupee';
};

/**
 * Validate if a currency code is supported
 */
export const isSupportedCurrency = (currency: string): boolean => {
  const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  return supportedCurrencies.includes(currency);
}; 
