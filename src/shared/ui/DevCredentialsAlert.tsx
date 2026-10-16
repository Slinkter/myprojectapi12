/**
 * @file DevCredentialsAlert.tsx
 * @description Componente de alerta accesible que notifica en tiempo de desarrollo
 * si faltan credenciales o configuraciones de servicios externos (Firebase, API base, etc.).
 * @architecture Shared UI Layer - Alerta de Diagnostico de Entorno
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  KeyRound,
  Info,
} from "lucide-react";
import {
  validateExternalServices,
  subscribeToServicesStatus,
  type IServicesStatusReport,
  type IExternalServiceDiagnostic,
} from "@/shared/lib/credentialsValidator";

const SESSION_STORAGE_DISMISSED_KEY = "dev_credentials_alert_dismissed";

/**
 * Componente de alerta para advertir sobre credenciales pendientes en modo desarrollo.
 *
 * @returns {JSX.Element | null} Elemento JSX de la alerta o null si no hay avisos.
 */
export const DevCredentialsAlert = () => {
  const [report, setReport] = useState<IServicesStatusReport>(() =>
    validateExternalServices()
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_STORAGE_DISMISSED_KEY) === "true";
  });

  useEffect(() => {
    const unsubscribe = subscribeToServicesStatus(() => {
      setReport(validateExternalServices());
    });
    return () => unsubscribe();
  }, []);

  const problematicServices = useMemo(
    () =>
      report.services.filter(
        (service) => service.status === "missing" || service.status === "invalid"
      ),
    [report.services]
  );

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_DISMISSED_KEY, "true");
    }
  }, []);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // No renderizar si no hay problemas o si el usuario descartó el banner en esta sesión
  if (!report.hasIssues || isDismissed || problematicServices.length === 0) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label="Aviso de configuracion de credenciales externas en desarrollo"
      className="w-full bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold tracking-wide uppercase text-[11px] px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100">
                  Desarrollo
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Configuracion de servicios externos requerida
                </span>
              </div>
              <p className="mt-1 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                Se detectaron servicios externos sin credenciales validas:{" "}
                <strong className="font-semibold text-amber-800 dark:text-amber-300">
                  {problematicServices.map((s) => s.name).join(", ")}
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleToggleExpand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-200/70 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-100 border border-amber-300/70 dark:border-amber-700/60 cursor-pointer transition-colors"
              aria-expanded={isExpanded}
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isExpanded ? "Ocultar detalles" : "Ver variables"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 transition-colors border-none bg-transparent cursor-pointer"
              aria-label="Cerrar aviso temporalmente"
              title="Cerrar aviso"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panel expandible con detalles tecnicos y variables pendientes */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-amber-200/80 dark:border-amber-800/60 text-xs space-y-4 animate-in fade-in duration-150">
            {problematicServices.map((service: IExternalServiceDiagnostic) => (
              <div
                key={service.id}
                className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-200/60 dark:border-amber-800/40 text-slate-800 dark:text-slate-200 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                      Servicio: {service.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                      {service.status === "missing" ? "Credenciales ausentes" : "Credencial rechazada"}
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Categoria: {service.category}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  {service.summary}
                </p>

                {service.runtimeError && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 font-mono text-[11px]">
                    <strong>Error detectado:</strong> {service.runtimeError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Impacto en la aplicacion:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                      {service.impact}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Variables de entorno requeridas:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      {service.requiredVars.map((v) => (
                        <li
                          key={v}
                          className={
                            service.missingVars.includes(v)
                              ? "text-red-600 dark:text-red-400 font-bold"
                              : "text-emerald-700 dark:text-emerald-400"
                          }
                        >
                          {v} {service.missingVars.includes(v) ? "(Pendiente)" : "(Definida)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pasos para solucionar:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                    {service.remedy}
                  </p>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto select-all">
{`# Crea un archivo .env en la raiz del proyecto:
VITE_FIREBASE_API_KEY=tu_api_key_valida
VITE_FIREBASE_AUTH_DOMAIN=slinkter-ea443.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=slinkter-ea443
VITE_FIREBASE_STORAGE_BUCKET=slinkter-ea443.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=401688208094
VITE_FIREBASE_APP_ID=1:401688208094:web:33225652db68c34eb4584f`}
                  </pre>
                </div>
              </div>
            ))}

            {/* Informacion de estado de la API de catalogo */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
              <Info className="h-3.5 w-3.5 text-blue-500 shrink-0" aria-hidden="true" />
              <span>
                El catalogo general de productos continua operando de manera autonoma mediante el servicio DummyJSON.
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
