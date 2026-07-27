# Diagramas UML

Diagramas de clases, secuencia, estados y actividad según el estándar UML 2.5 (*UML Distilled*, Martin Fowler).

---

## 1. Diagrama de Clases (Domain Model)

Entidades del dominio y sus relaciones.

```mermaid
classDiagram
  class IProduct {
    +number id
    +string title
    +string description
    +string category
    +number price
    +number discountPercentage
    +number rating
    +number stock
    +string brand
    +string thumbnail
    +string[] images
  }

  class ICartItem {
    +number quantity
  }

  class ICartContextValue {
    +ICartItem[] cart
    +number totalPrice
    +number totalItems
    +boolean isCartOpen
    +addToCart(product, quantity)
    +removeFromCart(productId)
    +updateQuantity(productId, quantity)
    +clearCart()
    +openCart()
    +closeCart()
    +toggleCart()
  }

  class ICardInfo {
    +string number
    +string name
    +string expiry
    +string cvc
  }

  class IValidationErrors {
    +string number
    +string name
    +string expiry
    +string cvc
  }

  class ICheckoutState {
    +PaymentMethod paymentMethod
    +ICardInfo cardInfo
    +IValidationErrors errors
    +string cardType
  }

  class IUseCheckoutReturn {
    +PaymentMethod paymentMethod
    +ICardInfo cardInfo
    +IValidationErrors errors
    +string cardType
    +handlePayment()
    +handlePaymentFieldChange(e)
    +selectPaymentMethod(method)
    +boolean isPaymentDisabled
  }

  class OrderState {
    +string orderId
    +ICartItem[] items
    +number total
    +string paymentMethod
  }

  ICartItem --|> IProduct : extends
  ICheckoutState --> ICardInfo
  ICheckoutState --> IValidationErrors
  IUseCheckoutReturn --> ICheckoutState : derived from
  OrderState --> ICartItem : contains
```

## 2. Diagrama de Secuencia — Flujo de Checkout

Muestra la interacción temporal entre objetos durante el proceso de pago.

```mermaid
sequenceDiagram
  participant U as Usuario
  participant CD as Cart Drawer
  participant CH as Checkout Page
  participant UC as useCheckout
  participant CC as CartContext
  participant CS as CheckoutSuccess

  U->>CD: Presiona "Proceder al Pago"
  CD->>CH: Navega a /checkout
  Note over CH: Redirige a / si carrito vacío

  U->>CH: Selecciona método de pago
  CH->>UC: selectPaymentMethod("credit_card")
  alt Bitcoin
    UC-->>CH: Oculta formulario de tarjeta
  else Tarjeta
    U->>CH: Ingresa número de tarjeta
    CH->>UC: handlePaymentFieldChange(e)
    UC->>UC: formatCardNumber()
    UC->>UC: detectCardType()
    UC-->>CH: Actualiza estado + errores en tiempo real
  end

  U->>CH: Ingresa código de descuento (opcional)
  U->>CH: Presiona "Pagar"
  CH->>UC: handlePayment()

  alt Validación falla
    UC-->>CH: Errores visibles en campos inválidos
    CH-->>U: Muestra errores
  else Validación exitosa
    UC->>UC: Genera orderId
    UC->>CC: clearCart()
    UC->>CS: navigate("/checkout-success", { state })
    CS-->>U: Muestra resumen: ID, items, total, método
  end
```

## 3. Diagrama de Estados — Ciclo de Vida del Carrito

Muestra los estados por los que pasa el carrito de compras.

```mermaid
stateDiagram-v2
  [*] --> Vacio : Inicio / clearCart

  Vacio --> ConItems : addToCart(product)
  Vacio --> [*] : Cerrar sesión

  ConItems --> ConItems : addToCart(product)
  ConItems --> ConItems : updateQuantity(id, n)
  ConItems --> ConItems : removeFromCart(id)

  ConItems --> Vacio : clearCart()
  ConItems --> Vacio : removeFromCart(último item)

  ConItems --> Checkout : "Proceder al Pago"
  Checkout --> ConItems : Volver / Cancelar
  Checkout --> Pagado : handlePayment() exitoso

  Pagado --> Vacio : clearCart() automático

  state ConItems {
    [*] --> DrawerCerrado
    DrawerCerrado --> DrawerAbierto : openCart()
    DrawerAbierto --> DrawerCerrado : closeCart()
    DrawerAbierto --> DrawerCerrado : toggleCart()
  }
```

## 4. Diagrama de Actividad — Proceso de Pago

Flujo de actividades del proceso de pago con decisiones y paralelismo.

```mermaid
flowchart TD
  A([Usuario presiona Pagar]) --> B{Carrito vacío?}
  B -->|Sí| C[Redirigir a /]
  C --> Z([Fin])

  B -->|No| D{Método de pago?}

  D -->|Bitcoin| E[Validar Bitcoin]
  E --> F[Generar orderId]
  F --> G[Vaciar carrito]
  G --> H[Navegar a CheckoutSuccess]
  H --> Z

  D -->|Tarjeta| I[Validar número Luhn]
  I --> J[Validar nombre]
  J --> K[Validar expiry MM/YY]
  K --> L[Validar CVC 3-4 dígitos]

  I --> M{¿Errores?}
  M -->|Sí| N[Mostrar errores en campos]
  N --> Z

  M -->|No| O[Calcular total con descuento]
  O --> P[Generar orderId]
  P --> Q[Vaciar carrito]
  Q --> R[Navegar a CheckoutSuccess con state]
  R --> Z
```

## 5. Diagrama de Paquetes — Estructura FSD

Muestra la organización en capas y las reglas de dependencia.

```mermaid
flowchart LR
  subgraph app["Capa App"]
    apiClient[apiClient]
    env[Config env]
    router[AppRouter]
  end

  subgraph features["Capa Features"]
    cart[Cart Feature]
    checkout[Checkout Feature]
    products[Products Feature]
    theme[Theme Feature]
  end

  subgraph shared["Capa Shared"]
    http[httpClient]
    hooks[Hooks]
    ui[UI Kit]
    lib[Utilities]
  end

  subgraph pages["Capa Pages"]
    home[Home]
  end

  pages --> features
  features --> shared
  app --> features
  shared -.->|No depende de| features
  pages -.->|No depende de| app
```
