/** Mapa de rutas de la aplicación. Centraliza todas las rutas para mantener consistencia y facilitar cambios. @remarks Las rutas dinámicas como PRODUCT_DETAIL usan funciones que reciben el ID. */
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout-success',
  NOT_FOUND: '*',
} as const

/** Tipo que representa cualquier ruta válida de la aplicación, excluyendo funciones. */
export type AppRoute = '/' | '/products' | '/cart' | '/checkout' | '/checkout-success' | '*'

/** Tipo para la función generadora de ruta de detalle de producto. */
export type ProductDetailRoute = (id: string | number) => string
