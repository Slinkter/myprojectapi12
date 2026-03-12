export type StockStatus = 'out' | 'low' | 'ok'

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out'
  if (stock <= 10) return 'low'
  return 'ok'
}
