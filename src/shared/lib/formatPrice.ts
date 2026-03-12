interface FormatPriceOptions {
  currency?: string
  locale?: string
}

export function formatPrice(
  amount: number,
  { currency = 'USD', locale = 'en-US' }: FormatPriceOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
