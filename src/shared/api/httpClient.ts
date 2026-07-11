const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

/** Error personalizado para peticiones HTTP con código de estado y texto asociado. @extends Error */
class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

/** Configuración extendida de petición que añade soporte para parámetros de consulta (query params). @extends RequestInit */
interface IRequestConfig extends RequestInit {
  params?: Record<string, string>
}

/** Realiza una petición HTTP genérica con tipado seguro. @template T - Tipo esperado de la respuesta. @param endpoint - Ruta del recurso (se concatena con BASE_URL). @param config - Configuración de la petición incluyendo query params. @returns Promesa con los datos tipados. @throws {HttpError} Si la respuesta HTTP no es exitosa. */
async function request<T>(
  endpoint: string,
  config: IRequestConfig = {}
): Promise<T> {
  const { params, headers, ...rest } = config
  const url = new URL(`${BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.statusText,
      `Request failed: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<T>
}

/** Cliente HTTP con métodos abreviados para GET, POST, PUT, PATCH y DELETE. Encapsula `request` con el método HTTP predefinido. */
export const httpClient = {
  /** Realiza una petición GET. @template T - Tipo de la respuesta. @param endpoint - Ruta del recurso. @param config - Configuración opcional. @returns Promesa con los datos tipados. */
  get: <T>(endpoint: string, config?: IRequestConfig) =>
    request<T>(endpoint, { method: 'GET', ...config }),

  /** Realiza una petición POST. @template T - Tipo de la respuesta. @param endpoint - Ruta del recurso. @param body - Cuerpo de la petición. @param config - Configuración opcional. @returns Promesa con los datos tipados. */
  post: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...config,
    }),

  /** Realiza una petición PUT. @template T - Tipo de la respuesta. @param endpoint - Ruta del recurso. @param body - Cuerpo de la petición. @param config - Configuración opcional. @returns Promesa con los datos tipados. */
  put: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...config,
    }),

  /** Realiza una petición PATCH. @template T - Tipo de la respuesta. @param endpoint - Ruta del recurso. @param body - Cuerpo de la petición. @param config - Configuración opcional. @returns Promesa con los datos tipados. */
  patch: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...config,
    }),

  /** Realiza una petición DELETE. @template T - Tipo de la respuesta. @param endpoint - Ruta del recurso. @param config - Configuración opcional. @returns Promesa con los datos tipados. */
  delete: <T>(endpoint: string, config?: IRequestConfig) =>
    request<T>(endpoint, { method: 'DELETE', ...config }),
}
