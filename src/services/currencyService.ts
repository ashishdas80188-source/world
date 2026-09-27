import { CurrencyCode, CurrencyMeta } from '../types/settings';

export const CURRENCY_METAS: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 1.0, flag: '🇺🇸' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateAgainstUSD: 83.5, flag: '🇮🇳' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateAgainstUSD: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.79, flag: '🇬🇧' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateAgainstUSD: 154.2, flag: '🇯🇵' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rateAgainstUSD: 7.24, flag: '🇨🇳' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateAgainstUSD: 1.53, flag: '🇦🇺' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateAgainstUSD: 1.37, flag: '🇨🇦' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateAgainstUSD: 1.35, flag: '🇸🇬' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateAgainstUSD: 3.67, flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rateAgainstUSD: 3.75, flag: '🇸🇦' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rateAgainstUSD: 0.91, flag: '🇨🇭' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rateAgainstUSD: 1.66, flag: '🇳🇿' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', rateAgainstUSD: 1375.0, flag: '🇰🇷' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rateAgainstUSD: 5.15, flag: '🇧🇷' },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', rateAgainstUSD: 16.85, flag: '🇲🇽' },
};

export class CurrencyService {
  private static customRates: Partial<Record<CurrencyCode, number>> = {};

  public static getRate(code: CurrencyCode): number {
    return this.customRates[code] ?? CURRENCY_METAS[code]?.rateAgainstUSD ?? 1.0;
  }

  public static setRate(code: CurrencyCode, rate: number): void {
    if (rate > 0) {
      this.customRates[code] = rate;
    }
  }

  public static convertFromUSD(amountInUSD: number, targetCurrency: CurrencyCode): number {
    const rate = this.getRate(targetCurrency);
    return amountInUSD * rate;
  }

  public static format(amountInUSD: number, targetCurrency: CurrencyCode, locale: string = 'en-US'): string {
    const converted = this.convertFromUSD(amountInUSD, targetCurrency);
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
        maximumFractionDigits: targetCurrency === 'JPY' || targetCurrency === 'KRW' ? 0 : 2,
      }).format(converted);
    } catch {
      const meta = CURRENCY_METAS[targetCurrency] || CURRENCY_METAS.USD;
      return `${meta.symbol}${converted.toFixed(2)}`;
    }
  }
}
