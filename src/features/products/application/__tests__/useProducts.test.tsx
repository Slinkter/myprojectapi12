import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as productsApi from '@/features/products/infrastructure/productsApi';
import type { ReactNode } from 'react';

// Mock productsApi
vi.mock('@/features/products/infrastructure/productsApi', () => ({
  getProducts: vi.fn(),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useProducts hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener productos inicialmente', async () => {
    const mockResponse = {
      products: [{ id: 1, title: 'Test Product', price: 10, stock: 5, thumbnail: 'img.jpg' }],
      total: 1,
      skip: 0,
      limit: 20
    };
    (productsApi.getProducts as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.initialLoading).toBe(true);

    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].title).toBe('Test Product');
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores de API', async () => {
    (productsApi.getProducts as any).mockRejectedValue(new Error('API Failure'));

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.initialLoading).toBe(false));

    expect(result.current.error).toBe('API Failure');
    expect(result.current.products).toHaveLength(0);
  });
});
