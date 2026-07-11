/**
 * @file useDiscountValidation.ts
 * @description Hook para la validación y aplicación de códigos de descuento en el checkout.
 * @architecture Capa de Aplicación - Lógica de Descuentos
 */

import { useState, useCallback } from 'react'

/**
 * @interface IDiscountCode
 * @description Representa un código de descuento válido con su tipo y valor.
 */
export interface IDiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

/**
 * Lista de códigos de descuento válidos predefinidos en la aplicación.
 * @type {IDiscountCode[]}
 */
const VALID_CODES: IDiscountCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE5', discount: 5, type: 'fixed' },
  { code: 'VIP20', discount: 20, type: 'percentage' },
]

/**
 * @interface UseDiscountValidationReturn
 * @description Retorno del hook useDiscountValidation.
 */
interface UseDiscountValidationReturn {
  code: string
  setCode: (code: string) => void
  appliedDiscount: IDiscountCode | null
  error: string
  isApplying: boolean
  applyDiscount: () => void
  removeDiscount: () => void
}

/**
 * Hook que gestiona la validación, aplicación y eliminación de códigos de descuento.
 * Simula una validación asíncrona contra una lista de códigos predefinidos.
 *
 * @returns {UseDiscountValidationReturn} Estado y funciones para gestionar descuentos.
 */
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

/**
 * Calcula el monto del descuento aplicado sobre el precio total.
 * Soporta descuentos porcentuales y montos fijos.
 *
 * @param {IDiscountCode | null} appliedDiscount - Código de descuento aplicado o null.
 * @param {number} totalPrice - Precio total antes del descuento.
 * @returns {number} Monto del descuento calculado.
 */
export function calculateDiscountAmount(
  appliedDiscount: IDiscountCode | null,
  totalPrice: number
): number {
  if (!appliedDiscount) return 0

  return appliedDiscount.type === 'percentage'
    ? (totalPrice * appliedDiscount.discount) / 100
    : appliedDiscount.discount
}
