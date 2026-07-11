# Feature: Checkout (Proceso de Pago)

El checkout implementa un formulario de pago simulado con validación de tarjetas, detección de tipo, soporte para Bitcoin y códigos de descuento.

---

## Estructura de Archivos

```
src/features/checkout/
├── domain/
│   └── formatters.ts           # formatCardNumber, formatExpiryDate, getCardType
├── application/
│   ├── types.ts                # ICardInfo, ICheckoutState, CheckoutAction, etc.
│   ├── checkoutReducer.ts      # Reducer para estado del checkout
│   ├── validation.ts           # validateCardInfo, algoritmo Luhn
│   ├── useCheckout.ts          # Hook principal del checkout
│   └── useDiscountValidation.ts # Hook para códigos de descuento
└── presentation/
    ├── Checkout.tsx            # Página principal de checkout
    ├── CheckoutHeader.tsx      # Encabezado con navegación y badge seguro
    ├── CheckoutSuccess.tsx     # Pantalla de confirmación
    ├── PaymentMethodSelector.tsx # Selector de método de pago
    ├── PaymentFormContainer.tsx # Contenedor condicional del formulario
    ├── PaymentSubmitButton.tsx  # Botón de pago con estado
    ├── SecurityBadge.tsx       # Distintivo de transacción segura
    └── components/
        ├── CheckoutSteps.tsx   # Indicador de pasos
        ├── CardForm.tsx        # Formulario de tarjeta
        ├── PaymentMethodRadio.tsx # Radio button visual
        ├── PriceRow.tsx        # Fila de precio
        └── OrderSummary.tsx    # Resumen del pedido
```

## Tipos Principales

```typescript
type PaymentMethod = "visa" | "mastercard" | "bitcoin";

interface ICardInfo {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface ICheckoutState {
  paymentMethod: PaymentMethod;
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
}

interface IUseCheckoutReturn {
  paymentMethod: PaymentMethod;
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  handlePayment: () => void;
  handlePaymentFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  isPaymentDisabled: boolean;
}
```

## Checkout Reducer (`checkoutReducer.ts`)

Maneja 4 acciones:

| Acción | Payload | Descripción |
|--------|---------|-------------|
| `SET_FIELD_VALUE` | `{ name: keyof ICardInfo, value: string }` | Actualiza un campo |
| `SET_PAYMENT_METHOD` | `PaymentMethod` | Cambia método de pago |
| `SET_ERRORS` | `IValidationErrors` | Establece errores de validación |
| `SET_CARD_TYPE` | `string` | Detecta tipo de tarjeta |

## useCheckout (`useCheckout.ts`)

Hook principal que orquesta:

1. **Estado** con `useReducer(checkoutReducer, initialState)`
2. **Validación en tiempo real** mediante `useEffect`
3. **Formateo automático** de número y fecha de expiración
4. **Detección de tipo** de tarjeta (Visa/Mastercard)
5. **Control de campos tocados** para mostrar errores solo después de interactuar
6. **Navegación** a `/checkout-success` en éxito

```typescript
export const useCheckout = (): IUseCheckoutReturn => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  // validación en efecto, formateo en handlePaymentFieldChange, etc.
};
```

## Validación (`validation.ts`)

- **Algoritmo de Luhn** simplificado para validar número de tarjeta
- **Validación de expiración**: formato MM/YY, mes 1-12, año futuro
- **Validación de nombre**: no vacío
- **Validación de CVC**: al menos 3 dígitos

```typescript
export const validateCardInfo = (cardInfo: ICardInfo): IValidationErrors => {
  const errors: IValidationErrors = {};
  const sanitizedCardNumber = cardInfo.number.replace(/\s/g, "");

  if (!sanitizedCardNumber) errors.number = "El número de tarjeta es requerido";
  else if (!isValidLuhn(sanitizedCardNumber)) errors.number = "Número de tarjeta inválido";

  if (!cardInfo.name.trim()) errors.name = "El nombre es requerido";
  // valida expiry y cvc...
  return errors;
};
```

## Formateo de Tarjeta (`formatters.ts`)

| Función | Descripción | Ejemplo |
|---------|-------------|---------|
| `formatCardNumber(value)` | Agrega espacios cada 4 dígitos | `"4111 1111 1111 1111"` |
| `formatExpiryDate(value)` | Agrega slash MM/YY | `"12/28"` |
| `getCardType(cardNumber)` | Detecta Visa (4) o Mastercard (5) | `"visa"` |

## Descuentos (`useDiscountValidation.ts`)

Códigos de descuento predefinidos:

| Código | Tipo | Valor |
|--------|------|-------|
| `WELCOME10` | Porcentaje | 10% |
| `SAVE5` | Fijo | $5 |
| `VIP20` | Porcentaje | 20% |

```typescript
export function useDiscountValidation(): UseDiscountValidationReturn {
  // code, appliedDiscount, error, isApplying
  // applyDiscount: simula validación asíncrona (500ms)
  // removeDiscount: limpia el descuento aplicado
}

export function calculateDiscountAmount(
  appliedDiscount: IDiscountCode | null,
  totalPrice: number
): number {
  // Porcentaje o fijo
}
```

## Componentes de Presentación

| Componente | Descripción |
|------------|-------------|
| `Checkout` | Página completa con formulario y OrderSummary |
| `CheckoutHeader` | Botón volver, título, badge "Pago Seguro" |
| `CheckoutSteps` | Barra de progreso: Carrito → Pago → Confirmación |
| `PaymentMethodSelector` | 3 radios visuales: Visa, Mastercard, Bitcoin |
| `PaymentFormContainer` | Muestra CardForm o mensaje Bitcoin según método |
| `PaymentSubmitButton` | Botón "Pagar Ahora" con spinner de carga |
| `SecurityBadge` | Candado + "Transacción segura encriptada" |
| `CheckoutSuccess` | Check verde + "Pago Exitoso" + botón continuar |
