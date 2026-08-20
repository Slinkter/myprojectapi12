/**
 * @file FAQ.tsx
 * @description Centro de Ayuda, Preguntas Frecuentes y Links Facilitadores para clientes de la tienda.
 * @architecture Pages Layer - Help & FAQ
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  MessageCircle, 
  Mail, 
  Package, 
  ShoppingBag, 
  ExternalLink
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

interface IFAQItem {
  id: string;
  category: "shipping" | "orders" | "payment" | "returns";
  question: string;
  answer: string;
}

const FAQ_DATA: IFAQItem[] = [
  {
    id: "orders-1",
    category: "orders",
    question: "¿Qué significa cada estado en el seguimiento de mi pedido?",
    answer: 
      "Tu pedido pasa por etapas claras: 1. 'Validando Compra' (revisión de la transacción), 2. 'En Almacén' (empaquetado del producto), 3. 'En Camino' (transportista en ruta), 4. 'Entregado' (llegó a tu dirección), y 5. 'Recibido' (cuando confirmas satisfacción). Si surge un inconveniente, puede marcarse como 'Entrega Fallida' para reprogramar, o 'Anulado/Rechazado' con reintegro de inventario."
  },
  {
    id: "orders-2",
    category: "orders",
    question: "¿Cómo puedo rastrear mi compra en tiempo real?",
    answer: 
      "En el menú superior, haz clic en el botón 'Compras' o 'Pedidos'. Allí verás una línea de tiempo dinámica que se actualiza en vivo sin necesidad de recargar la página, junto con las notas u observaciones dejadas por el equipo de administración."
  },
  {
    id: "orders-3",
    category: "orders",
    question: "¿Cómo confirmo que recibí mi producto?",
    answer: 
      "Una vez que el estado de tu pedido figure como 'Entregado', aparecerá un botón verde en la tarjeta de tu pedido titulado 'Confirmar que recibí mi producto'. Al hacer clic, el pedido pasará a 'Recibido por Cliente'."
  },
  {
    id: "shipping-1",
    category: "shipping",
    question: "¿Cómo obtengo envío gratuito?",
    answer: 
      "Ofrecemos envío estándar gratuito en todas las compras a partir de $50 USD. En el carrito de compras verás una barra de progreso que te indica exactamente cuánto te falta para alcanzar el envío sin costo."
  },
  {
    id: "shipping-2",
    category: "shipping",
    question: "¿Qué ocurre si mi entrega figura como 'Entrega Fallida'?",
    answer: 
      "Si el transportista no encontró a nadie en la dirección o hubo un error en los datos de entrega, el estado cambiará a 'Entrega Fallida' y el administrador añadirá una nota de observación. Nos contactaremos contigo para coordinar una segunda entrega sin costo adicional."
  },
  {
    id: "payment-1",
    category: "payment",
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: 
      "Aceptamos tarjetas de crédito y débito Visa y Mastercard con validación Luhn en tiempo real, además de pagos directos mediante Bitcoin con confirmación instantánea."
  },
  {
    id: "returns-1",
    category: "returns",
    question: "¿Qué pasa si anulo un pedido o si la compra es rechazada?",
    answer: 
      "Cuando un pedido es anulado o cancelado por administración, el sistema automáticamente reincorpora los productos al inventario disponible de la tienda mediante transacciones atómicas."
  },
];

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "orders-1": true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = activeCategory === "all"
    ? FAQ_DATA
    : FAQ_DATA.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[85vh]">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
          <HelpCircle size={16} />
          Centro de Ayuda & FAQ
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          ¿Cómo podemos ayudarte hoy?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
          Encuentra respuestas inmediatas sobre estados de pedido, envíos, métodos de pago y políticas de nuestra tienda.
        </p>
      </div>

      {/* Links Facilitadores Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          to="/orders"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md group no-underline"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Package size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
            Rastrear Pedido
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consulta el estado en vivo y la línea de tiempo de tus compras.
          </p>
        </Link>

        <Link
          to="/"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md group no-underline"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
            Explorar Catálogo
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Revisa productos destacados y promociones disponibles.
          </p>
        </Link>

        <a
          href="mailto:soporte@myprojectapi12.com?subject=Consulta%20sobre%20pedido"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md group no-underline"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mail size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
            Soporte por Email <ExternalLink size={12} />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Escríbenos directamente y un asesor te responderá en minutos.
          </p>
        </a>
      </div>

      {/* Selector de Categorías de Preguntas */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: "all", label: "Todas las preguntas", icon: HelpCircle },
          { id: "orders", label: "Estados & Seguimiento", icon: Package },
          { id: "shipping", label: "Envíos & Tiempos", icon: Truck },
          { id: "payment", label: "Pagos & Seguridad", icon: CreditCard },
          { id: "returns", label: "Garantías & Stock", icon: RotateCcw },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === tab.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <IconComponent size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Acordeón de Preguntas */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openItems[faq.id];
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {faq.question}
                </span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-150 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 px-5 py-4"
                  >
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de Soporte Personalizado */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-primary/10 border border-emerald-500/20 text-center space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          ¿No encontraste lo que buscabas?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Nuestro equipo de atención al cliente está disponible 24/7 para resolver cualquier inquietud sobre tus compras.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/51999999999?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pedido%20en%20MyProjectAPI12"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 no-underline"
          >
            <MessageCircle size={15} />
            Chat por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
