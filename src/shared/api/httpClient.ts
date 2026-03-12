const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

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

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
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

export const httpClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { method: 'GET', ...config }),

  post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...config,
    }),

  put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...config,
    }),

  patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...config,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { method: 'DELETE', ...config }),
}
