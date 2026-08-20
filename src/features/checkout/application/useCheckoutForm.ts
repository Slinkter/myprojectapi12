/**
 * @file useCheckoutForm.ts
 * @description Hook especializado para el manejo y validación del estado del formulario de checkout.
 * Implementa inicialización perezosa de estado (rerender-lazy-state-init) y actualizaciones funcionales (rerender-functional-setstate).
 * @architecture Capa de Aplicación - Lógica de Formulario de Checkout
 */

import { useState, useCallback, ChangeEvent } from "react";
import type { ICardInfo, IValidationErrors } from "@/features/checkout/application/types";

/**
 * @interface ICheckoutFormOptions
 * @description Opciones de configuración inicial para el hook useCheckoutForm.
 */
export interface ICheckoutFormOptions {
  /** Valores iniciales opcionales para los campos del formulario */
  initialValues?: Partial<ICardInfo>;
}

/**
 * @interface IUseCheckoutFormReturn
 * @description Retorno del hook useCheckoutForm con estado y manipuladores memoizados.
 */
export interface IUseCheckoutFormReturn {
  /** Información actual de la tarjeta en el formulario */
  cardInfo: ICardInfo;
  /** Errores de validación activos */
  errors: IValidationErrors;
  /** Registro de campos que han sido interactuados por el usuario */
  touched: Record<string, boolean>;
  /** Indica si se intentó enviar el formulario */
  isSubmitted: boolean;
  /** Manejador de evento change para inputs de formulario */
  handleFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Establece el valor de un campo específico con actualización funcional */
  setFieldValue: (field: keyof ICardInfo, value: string) => void;
  /** Marca un campo como interactuado (touched) */
  setFieldTouched: (field: string, isTouched?: boolean) => void;
  /** Establece errores de validación directamente */
  setValidationErrors: (newErrors: IValidationErrors) => void;
  /** Marca todos los campos como touched y establece isSubmitted en true */
  submitForm: () => void;
  /** Reinicia el estado del formulario a sus valores por defecto */
  resetForm: () => void;
}

/** Valores por defecto iniciales para la información de tarjeta */
const DEFAULT_CARD_INFO: ICardInfo = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
};

/**
 * Hook para gestionar el estado, validación e interacción del formulario de pago.
 *
 * @param {ICheckoutFormOptions} [options] - Opciones de inicialización del formulario.
 * @returns {IUseCheckoutFormReturn} Objeto con estado y métodos para interactuar con el formulario.
 *
 * @example
 * const {
 *   cardInfo,
 *   errors,
 *   handleFieldChange,
 *   submitForm,
 *   resetForm
 * } = useCheckoutForm();
 */
export const useCheckoutForm = (
  options?: ICheckoutFormOptions,
): IUseCheckoutFormReturn => {
  // Inicialización perezosa de estados complejos para evitar recalcular en cada render
  const [cardInfo, setCardInfo] = useState<ICardInfo>(() => ({
    ...DEFAULT_CARD_INFO,
    ...(options?.initialValues ?? {}),
  }));

  const [touched, setTouched] = useState<Record<string, boolean>>(() => ({}));
  const [errors, setErrors] = useState<IValidationErrors>(() => ({}));
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => false);

  /**
   * Manejador de cambios genérico para inputs HTML con actualización funcional de estado.
   */
  const handleFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  /**
   * Actualiza el valor de un campo específico de forma segura y funcional.
   */
  const setFieldValue = useCallback(
    (field: keyof ICardInfo, value: string) => {
      setCardInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /**
   * Marca un campo como tocado o intocado.
   */
  const setFieldTouched = useCallback((field: string, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  /**
   * Actualiza el objeto de errores de validación.
   */
  const setValidationErrors = useCallback(
    (newErrors: IValidationErrors) => {
      setErrors(() => newErrors);
    },
    [],
  );

  /**
   * Prepara el formulario para envío marcando todos los campos requeridos como tocados.
   */
  const submitForm = useCallback(() => {
    setIsSubmitted(() => true);
    setTouched(() => ({
      number: true,
      name: true,
      expiry: true,
      cvc: true,
    }));
  }, []);

  /**
   * Reinicia todos los estados del formulario a sus valores originales.
   */
  const resetForm = useCallback(() => {
    setCardInfo(() => ({ ...DEFAULT_CARD_INFO }));
    setTouched(() => ({}));
    setErrors(() => ({}));
    setIsSubmitted(() => false);
  }, []);

  return {
    cardInfo,
    errors,
    touched,
    isSubmitted,
    handleFieldChange,
    setFieldValue,
    setFieldTouched,
    setValidationErrors,
    submitForm,
    resetForm,
  };
};
