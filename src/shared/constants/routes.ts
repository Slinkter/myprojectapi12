export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  NOT_FOUND: '*',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
