import { useState, useCallback } from 'react'

export interface IDiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

const VALID_CODES: IDiscountCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE5', discount: 5, type: 'fixed' },
  { code: 'VIP20', discount: 20, type: 'percentage' },
]

interface UseDiscountValidationReturn {
  code: string
  setCode: (code: string) => void
  appliedDiscount: IDiscountCode | null
  error: string
  isApplying: boolean
  applyDiscount: () => void
  removeDiscount: () => void
}

export function useDiscountValidation(): UseDiscountValidationReturn {
  const [code, setCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<IDiscountCode | null>(null)
  const [error, setError] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const applyDiscount = useCallback(() => {
    if (!code.trim()) return

    setIsApplying(true)
    setError('')

    setTimeout(() => {
      const found = VALID_CODES.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      )

      if (found) {
        setAppliedDiscount(found)
        setCode('')
      } else {
        setError('Código de descuento inválido')
      }
      setIsApplying(false)
    }, 500)
  }, [code])

  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null)
    setError('')
  }, [])

  return {
    code,
    setCode,
    appliedDiscount,
    error,
    isApplying,
    applyDiscount,
    removeDiscount,
  }
}

export function calculateDiscountAmount(
  appliedDiscount: IDiscountCode | null,
  totalPrice: number
): number {
  if (!appliedDiscount) return 0

  return appliedDiscount.type === 'percentage'
    ? (totalPrice * appliedDiscount.discount) / 100
    : appliedDiscount.discount
}
