export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    lists: () => [...QUERY_KEYS.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...QUERY_KEYS.products.lists(), filters] as const,
    details: () => [...QUERY_KEYS.products.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.products.details(), id] as const,
    categories: () => [...QUERY_KEYS.products.all, 'categories'] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => [...QUERY_KEYS.orders.all, id] as const,
  },
} as const
