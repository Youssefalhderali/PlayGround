import type { Currency } from '../types'

export const CURRENCIES: Currency[] = ['YER', 'SAR', 'USD']

export const CURRENCY_META: Record<Currency, { ar: string; en: string; symbol: string; decimals: number }> = {
  YER: { ar: 'ريال يمني', en: 'Yemeni Rial', symbol: 'ر.ي', decimals: 0 },
  SAR: { ar: 'ريال سعودي', en: 'Saudi Riyal', symbol: 'ر.س', decimals: 2 },
  USD: { ar: 'دولار أمريكي', en: 'US Dollar', symbol: '$', decimals: 2 },
}

export function convert(amount: number, from: Currency, to: Currency, perUsd: Record<Currency, number>): number {
  if (!Number.isFinite(amount)) return 0
  const fromRate = perUsd[from] || 1
  const toRate = perUsd[to] || 1
  return (amount / fromRate) * toRate
}

export function formatMoney(amount: number, currency: Currency, lang: 'ar' | 'en'): string {
  const meta = CURRENCY_META[currency]
  const value = new Intl.NumberFormat(lang === 'ar' ? 'ar-YE' : 'en-US', {
    maximumFractionDigits: meta.decimals,
    minimumFractionDigits: 0,
  }).format(amount)
  return lang === 'ar' ? `${value} ${meta.symbol}` : `${meta.symbol}${value}`
}

export function displayPrice(
  amount: number,
  from: Currency,
  to: Currency,
  perUsd: Record<Currency, number>,
  lang: 'ar' | 'en',
): string {
  return formatMoney(convert(amount, from, to, perUsd), to, lang)
}
