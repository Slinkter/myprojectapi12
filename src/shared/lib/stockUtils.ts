/** Representa el estado de stock de un producto: 'out' (sin stock), 'low' (bajo), 'ok' (disponible). */
export type StockStatus = 'out' | 'low' | 'ok'

/** Determina el estado de stock según la cantidad disponible. @param stock - Cantidad actual en inventario. @returns 'out' si es 0, 'low' si es ≤ 10, 'ok' en caso contrario. @example getStockStatus(0) // => 'out' */
export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out'
  if (stock <= 10) return 'low'
  return 'ok'
}
