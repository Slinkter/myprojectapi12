/**
 * @file Orders.tsx
 * @description Gestión y rastreo de pedidos en tiempo real con línea de tiempo interactiva,
 * auditoría de cambios de estado, notas del administrador y confirmación de recepción.
 * @architecture Pages Layer - Orders
 */

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/application/AuthContext";
import { 
  subscribeToAllOrders, 
  subscribeToUserOrders, 
  updateOrderStatusAndNotes, 
  IOrderDocument,
  OrderStatus 
} from "@/features/orders/infrastructure/ordersFirestore";
import { ORDER_STATUS_LABELS } from "@/features/orders/domain/orderTypes";
import Loader from "@/shared/ui/Loader";
import { m, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  CheckCheck,
  Search,
  MessageSquare,
  History,
  RotateCcw,
  Printer
} from "lucide-react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
};

export const Orders: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<IOrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para el modal de actualización de admin
  const [editingOrder, setEditingOrder] = useState<IOrderDocument | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("validando_compra");
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    let unsubscribe: () => void;
    if (user.role === "admin") {
      unsubscribe = subscribeToAllOrders(
        (data) => {
          setOrders(data);
          setLoading(false);
        },
        (error) => {
          console.error("Error al cargar pedidos:", error);
          setLoading(false);
        }
      );
    } else {
      unsubscribe = subscribeToUserOrders(
        user.uid,
        (data) => {
          setOrders(data);
          setLoading(false);
        },
        (error) => {
          console.error("Error al cargar pedidos del cliente:", error);
          setLoading(false);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handlePrintTicket = (order: IOrderDocument) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const itemsHtml = order.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.title}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(i.price * i.quantity)}</td>
        </tr>`
      )
      .join("");

    const orderDate = order.createdAt?.toDate 
      ? order.createdAt.toDate().toLocaleString("es-ES", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Reciente";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Pedido - ${order.orderId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: auto; }
            h1 { font-size: 22px; margin-bottom: 4px; color: #0f172a; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
            th { text-align: left; background: #f8fafc; padding: 8px; border-bottom: 2px solid #cbd5e1; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #059669; }
            .badge { display: inline-block; padding: 4px 10px; background: #ecfdf5; color: #059669; font-weight: bold; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MyProjectAPI12 Store</h1>
            <p style="font-size: 12px; color: #64748b; margin: 0;">Comprobante de Compra y Despacho</p>
          </div>
          <p><strong>ID de Pedido:</strong> ${order.orderId}</p>
          <p><strong>Cliente:</strong> ${order.email}</p>
          <p><strong>Fecha:</strong> ${orderDate}</p>
          <p><strong>Estado Actual:</strong> <span class="badge">${order.status.toUpperCase()}</span></p>
          <p><strong>Método de Pago:</strong> ${order.paymentMethod.toUpperCase()}</p>
          
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: center;">Cantidad</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p class="total">Total Pagado: ${formatPrice(order.total)}</p>
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px;">¡Gracias por tu compra en MyProjectAPI12!</p>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (authLoading) return <Loader />;
  if (!user) return <Navigate to="/?login=true" replace />;

  const handleOpenStatusModal = (order: IOrderDocument) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setAdminNote(order.adminNotes || "");
  };

  const handleSaveStatusUpdate = async () => {
    if (!editingOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatusAndNotes(
        editingOrder.orderId,
        newStatus,
        adminNote,
        `Admin (${user.email || "Administrador"})`
      );
      setEditingOrder(null);
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      alert("Hubo un error al actualizar el pedido.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Acción del cliente: Confirmar que recibió su producto
  const handleConfirmReceived = async (orderId: string) => {
    if (confirm("¿Confirmas que has recibido tu pedido a satisfacción?")) {
      try {
        await updateOrderStatusAndNotes(
          orderId,
          "recibido",
          "El cliente confirmó la recepción de su pedido desde la plataforma.",
          `Cliente (${user.email || "Usuario"})`
        );
      } catch (error) {
        console.error(error);
        alert("Error al confirmar la recepción del pedido.");
      }
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Filtrado de pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "active") {
      return ["validando_compra", "en_almacen", "en_camino"].includes(order.status);
    }
    if (filterTab === "completed") {
      return ["entregado", "recibido"].includes(order.status);
    }
    if (filterTab === "cancelled") {
      return ["anulado", "rechazado", "entrega_fallida"].includes(order.status);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-[85vh]">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {user.role === "admin" ? "Gestión de Pedidos" : "Mis Pedidos"}
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Radio size={12} className="animate-pulse text-emerald-500" />
              Tiempo Real
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {user.role === "admin"
              ? "Panel administrativo: aprueba compras, actualiza estados, agrega observaciones o anula pedidos."
              : "Rastrea el progreso de tus compras en vivo con el historial completo de envíos."}
          </p>
        </div>

        {user.role === "admin" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800 self-start sm:self-auto">
            <ShieldCheck size={16} />
            Modo Administrador
          </span>
        )}
      </div>

      {/* Controles de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        {/* Pestañas de estado */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilterTab("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "active"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            En Proceso
          </button>
          <button
            onClick={() => setFilterTab("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "completed"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Entregados / Recibidos
          </button>
          <button
            onClick={() => setFilterTab("cancelled")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "cancelled"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Alertas / Anulados
          </button>
        </div>

        {/* Buscador de pedido */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID o correo..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <Loader />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <Package className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No hay pedidos en esta sección</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm 
              ? "No se encontraron coincidencias para tu búsqueda."
              : user.role === "admin"
                ? "No hay pedidos con el estado seleccionado."
                : "Aún no tienes pedidos registrados aquí. ¡Explora el catálogo y añade productos al carrito!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;
            const statusConfig = ORDER_STATUS_LABELS[order.status] || {
              label: order.status,
              description: "",
              color: "bg-slate-100 text-slate-700",
            };
            const orderDate = order.createdAt?.toDate 
              ? order.createdAt.toDate().toLocaleString("es-ES", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Reciente";

            return (
              <div 
                key={order.orderId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Cabecera del pedido */}
                <div 
                  onClick={() => toggleExpand(order.orderId)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        {order.orderId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Fecha: {orderDate} • Pago: <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{order.paymentMethod}</span>
                    </span>
                    {user.role === "admin" && (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                        Cliente: <strong className="text-slate-900 dark:text-slate-100">{order.email}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
                      <span className="text-lg font-extrabold text-primary">{formatPrice(order.total)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                <AnimatePresence>
                  {isExpanded && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-150 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-5 sm:p-6 space-y-6"
                    >
                      {/* Observaciones del Administrador */}
                      {order.adminNotes && (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                          <MessageSquare className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
                          <div>
                            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                              Nota de Administración
                            </h4>
                            <p className="text-sm text-amber-800 dark:text-amber-400 mt-0.5">
                              {order.adminNotes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Botón de acción para el Cliente: Confirmar Recepción */}
                      {user.role !== "admin" && order.status === "entregado" && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <CheckCheck className="text-emerald-600 dark:text-emerald-400" size={20} />
                            <div>
                              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                ¿Ya recibiste tus productos?
                              </p>
                              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                Confirma la entrega para cerrar tu pedido satisfactoriamente.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleConfirmReceived(order.orderId)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/20 transition-all shrink-0"
                          >
                            Confirmar que recibí mi producto
                          </button>
                        </div>
                      )}

                      {/* Botón de acción para el Administrador */}
                      {user.role === "admin" && (
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                          <div className="space-y-0.5 text-center sm:text-left">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                              Control de Gestión de Pedido
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block">
                              Actualiza el estado, valida el pago, escribe notas al cliente o cancela con devolución de stock.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(order)}
                            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer shrink-0"
                          >
                            Gestionar / Cambiar Estado
                          </button>
                        </div>
                      )}

                      {/* Línea de tiempo visual del flujo estándar */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                          Línea de Tiempo de Envío
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center relative">
                          {[
                            { key: "validando_compra", label: "Validando", icon: Clock },
                            { key: "en_almacen", label: "En Almacén", icon: Package },
                            { key: "en_camino", label: "En Camino", icon: Truck },
                            { key: "entregado", label: "Entregado", icon: CheckCircle2 },
                            { key: "recibido", label: "Recibido", icon: CheckCheck },
                          ].map((step, idx) => {
                            const isCancelled = ["anulado", "rechazado", "entrega_fallida"].includes(order.status);
                            const activeIndex = ["validando_compra", "en_almacen", "en_camino", "entregado", "recibido"].indexOf(order.status);
                            const isCurrent = order.status === step.key;
                            const isPassed = activeIndex >= idx && !isCancelled;
                            const IconComponent = step.icon;

                            return (
                              <div key={step.key} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isPassed || isCurrent
                                    ? "bg-primary border-primary text-white"
                                    : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400"
                                }`}>
                                  <IconComponent size={14} />
                                </div>
                                <span className={`text-[11px] font-bold ${
                                  isCurrent ? "text-primary" : "text-slate-600 dark:text-slate-400"
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detalle de Productos Comprados */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                          Artículos del Pedido ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                        </h4>
                        <div className="divide-y divide-slate-150 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-sm">
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                  {item.title}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                                  {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"} • {formatPrice(item.price)} c/u
                                </span>
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Historial de Auditoría de Cambios */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <History size={14} className="text-slate-400" />
                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Historial de Auditoría y Eventos
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {order.statusHistory.map((hist, idx) => {
                              const histDate = hist.timestamp?.toDate
                                ? hist.timestamp.toDate().toLocaleString("es-ES", {
                                    dateStyle: "short",
                                    timeStyle: "medium",
                                  })
                                : "Reciente";
                              const histLabel = ORDER_STATUS_LABELS[hist.status]?.label || hist.status;

                              return (
                                <div key={idx} className="text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {histLabel}
                                      </span>
                                      {hist.updatedBy && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                          {hist.updatedBy}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">
                                      {hist.note}
                                    </p>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                                    {histDate}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Botón de Impresión de Comprobante */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => handlePrintTicket(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Printer size={14} />
                          Imprimir Comprobante
                        </button>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Gestión para el Administrador */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center min-h-screen">
          <div 
            aria-hidden="true" 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isUpdating && setEditingOrder(null)} 
          />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Gestionar Pedido {editingOrder.orderId}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cliente: <strong className="text-slate-700 dark:text-slate-300">{editingOrder.email}</strong> • Total: <strong className="text-primary">{formatPrice(editingOrder.total)}</strong>
              </p>
            </div>

            {/* Selector de Nuevo Estado */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Estado del Pedido:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="validando_compra">⏳ Validando Compra</option>
                <option value="en_almacen">📦 En Almacén (Pago Aprobado)</option>
                <option value="en_camino">🚚 En Camino (Despachado)</option>
                <option value="entregado">📍 Entregado en Destino</option>
                <option value="recibido">✅ Recibido y Conforme</option>
                <option value="entrega_fallida">⚠️ Entrega Fallida (Dirección/Ausente)</option>
                <option value="rechazado">❌ Pago Rechazado</option>
                <option value="anulado">🚫 Anular Pedido (Restaura Stock)</option>
              </select>
            </div>

            {/* Advertencia especial para anulaciones */}
            {(newStatus === "anulado" || newStatus === "rechazado") && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <RotateCcw size={16} className="shrink-0" />
                <span>
                  Al marcar como <strong>{newStatus}</strong>, los artículos comprados serán reincorporados automáticamente al stock de Firestore.
                </span>
              </div>
            )}

            {/* Nota u Observación del Admin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Observaciones / Nota para el Cliente:
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ejemplo: Pago validado con éxito. El paquete será despachado mañana a primera hora..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveStatusUpdate}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 cursor-pointer transition-all flex items-center gap-2"
              >
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
