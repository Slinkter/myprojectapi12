/**
 * @file eventBus.ts
 * @description Implementación del patrón Observer / Bus de Eventos de Dominio para desacoplar componentes y features.
 * Permite la comunicación asíncrona y reactiva basada en eventos tipados sin acoplamiento directo entre capas.
 * @architecture Shared Infrastructure Layer - Domain Event Bus (Observer Pattern)
 */

/**
 * Tipo genérico para funciones callback suscritas a eventos del bus.
 * @template T Tipo del payload de datos transportado por el evento.
 */
export type EventCallback<T = unknown> = (data: T) => void;

/**
 * Catálogo estandarizado de nombres de eventos de dominio admitidos en la plataforma.
 */
export const DomainEvents = {
  /** Emitido cuando el usuario envía una búsqueda desde el Navbar o buscador global */
  SEARCH_TRIGGERED: "catalog:search_triggered",
  /** Emitido cuando se añade un artículo al carrito de compras */
  CART_ITEM_ADDED: "cart:item_added",
  /** Emitido cuando se elimina un artículo del carrito de compras */
  CART_ITEM_REMOVED: "cart:item_removed",
  /** Emitido cuando se limpia completamente el carrito de compras */
  CART_CLEARED: "cart:cleared",
  /** Emitido cuando se completa exitosamente una orden de compra */
  ORDER_PLACED: "checkout:order_placed",
} as const;

/**
 * Tipo que representa las claves de los eventos de dominio disponibles.
 */
export type DomainEventType = (typeof DomainEvents)[keyof typeof DomainEvents] | string;

/**
 * Payload para el evento de búsqueda en catálogo.
 */
export interface ISearchTriggeredPayload {
  query: string;
}

/**
 * @class DomainEventBus
 * @description Bus de eventos centralizado en memoria que implementa el patrón de diseño Observer.
 * Permite suscribirse (`on` o `subscribe`), emitir (`emit` o `publish`) y desuscribirse limpiamente.
 */
export class DomainEventBus {
  /** Mapa de suscriptores indexado por nombre de evento */
  private listeners: Map<string, Set<EventCallback<unknown>>> = new Map();

  /**
   * Suscribe un callback a un evento específico.
   *
   * @template T Tipo del payload que recibirá el callback.
   * @param {string} event Nombre del evento a escuchar.
   * @param {EventCallback<T>} callback Función ejecutada al publicarse el evento.
   * @returns {() => void} Función de desuscripción para limpieza en `useEffect`.
   */
  public on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(callback as EventCallback<unknown>);

    return () => {
      set.delete(callback as EventCallback<unknown>);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Alias de `on` para mayor compatibilidad semántica.
   *
   * @template T Tipo del payload que recibirá el callback.
   * @param {string} event Nombre del evento a escuchar.
   * @param {EventCallback<T>} callback Función ejecutada al publicarse el evento.
   * @returns {() => void} Función de desuscripción.
   */
  public subscribe<T>(event: string, callback: EventCallback<T>): () => void {
    return this.on<T>(event, callback);
  }

  /**
   * Emite un evento con sus datos asociados a todos los observadores registrados.
   *
   * @template T Tipo del payload de datos.
   * @param {string} event Nombre del evento a emitir.
   * @param {T} data Payload de datos a transmitir.
   */
  public emit<T>(event: string, data: T): void {
    const set = this.listeners.get(event);
    if (!set) return;

    // Iteramos sobre una copia para evitar problemas de mutación durante la ejecución
    Array.from(set).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error procesando observador para evento "${event}":`, error);
      }
    });
  }

  /**
   * Alias de `emit` para mayor compatibilidad semántica.
   *
   * @template T Tipo del payload de datos.
   * @param {string} event Nombre del evento a publicar.
   * @param {T} data Payload de datos a transmitir.
   */
  public publish<T>(event: string, data: T): void {
    this.emit<T>(event, data);
  }

  /**
   * Elimina todos los suscriptores registrados en el bus (útil para tests o reset global).
   */
  public clear(): void {
    this.listeners.clear();
  }
}

/**
 * Instancia singleton global del bus de eventos de dominio.
 */
export const eventBus = new DomainEventBus();
