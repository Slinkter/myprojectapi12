/**
 * @file credentialsValidator.ts
 * @description Utilidad para validar la presencia y validez de las credenciales de servicios externos
 * (Firebase, API de catálogo, etc.) tanto en tiempo de compilación como en tiempo de ejecución.
 * @architecture Shared Library Layer
 */

/**
 * Representa el estado de configuración de un servicio externo.
 */
export type ServiceStatus = "configured" | "missing" | "invalid" | "fallback";

/**
 * Información detallada de diagnóstico de un servicio externo.
 */
export interface IExternalServiceDiagnostic {
  id: "firebase" | "catalogApi";
  name: string;
  category: string;
  status: ServiceStatus;
  isConfigured: boolean;
  requiredVars: string[];
  missingVars: string[];
  summary: string;
  impact: string;
  remedy: string;
  runtimeError?: string;
}

/**
 * Reporte global de estado de todos los servicios externos.
 */
export interface IServicesStatusReport {
  hasIssues: boolean;
  services: IExternalServiceDiagnostic[];
}

/** Clave conocida revocada o por defecto para evitar falsos positivos de configuración */
const REVOKED_DEFAULT_KEY = "AIzaSyBn37QK_KuiHPWma02UOD7-IwE25QiXYSA";

/** Almacén en memoria de errores en tiempo de ejecución */
const runtimeErrors: Record<string, string> = {};

/** Suscriptores para cambios reactivos de estado */
type Listener = () => void;
const listeners: Set<Listener> = new Set();

/**
 * Registra un error de tiempo de ejecución para un servicio específico (ej. 400 Bad Request en Firebase Installations o Auth).
 *
 * @param serviceId - Identificador del servicio externo ('firebase' | 'catalogApi').
 * @param errorMessage - Mensaje descriptivo del error capturado.
 */
export function reportServiceRuntimeError(
  serviceId: "firebase" | "catalogApi",
  errorMessage: string
): void {
  runtimeErrors[serviceId] = errorMessage;
  listeners.forEach((listener) => listener());
}

/**
 * Limpia el error de tiempo de ejecución registrado para un servicio.
 *
 * @param serviceId - Identificador del servicio externo.
 */
export function clearServiceRuntimeError(serviceId: "firebase" | "catalogApi"): void {
  delete runtimeErrors[serviceId];
  listeners.forEach((listener) => listener());
}

/**
 * Suscribe una función para recibir actualizaciones cuando cambie el estado de algún servicio en tiempo de ejecución.
 *
 * @param callback - Función a ejecutar ante cambios de estado.
 * @returns Función de desuscripción.
 */
export function subscribeToServicesStatus(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Evalúa las credenciales y el estado actual de los servicios externos configurados en el proyecto.
 *
 * @returns {IServicesStatusReport} Reporte con el diagnóstico de cada servicio y un indicador global de problemas.
 */
export function validateExternalServices(): IServicesStatusReport {
  const firebaseRequiredVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  const env = import.meta.env;

  // Evaluación de Firebase
  const missingFirebaseVars: string[] = [];
  firebaseRequiredVars.forEach((varName) => {
    const val = env[varName];
    if (!val || typeof val !== "string" || val.trim().length === 0) {
      missingFirebaseVars.push(varName);
    }
  });

  const firebaseApiKey = env.VITE_FIREBASE_API_KEY;
  const isDefaultRevokedKey = firebaseApiKey === REVOKED_DEFAULT_KEY;
  const hasRuntimeError = Boolean(runtimeErrors.firebase);

  let firebaseStatus: ServiceStatus = "configured";
  let firebaseSummary = "Firebase configurado correctamente con variables de entorno.";

  if (missingFirebaseVars.length > 0) {
    firebaseStatus = "missing";
    firebaseSummary = `Faltan ${missingFirebaseVars.length} variables de entorno de Firebase.`;
  } else if (isDefaultRevokedKey || hasRuntimeError) {
    firebaseStatus = "invalid";
    firebaseSummary = hasRuntimeError
      ? `Error de credenciales en Firebase: ${runtimeErrors.firebase}`
      : "La clave API configurada es la predeterminada y ha sido rechazada por Google Cloud.";
  }

  const firebaseDiagnostic: IExternalServiceDiagnostic = {
    id: "firebase",
    name: "Firebase (Auth & Cloud Firestore)",
    category: "Autenticacion y Base de Datos",
    status: firebaseStatus,
    isConfigured: firebaseStatus === "configured",
    requiredVars: firebaseRequiredVars,
    missingVars: missingFirebaseVars,
    summary: firebaseSummary,
    impact:
      "El inicio de sesión y registro de usuarios no funcionaran. Las operaciones de guardado de compras y CRUD en Firestore no podran persistir cambios remotamente.",
    remedy:
      "Crea un archivo .env en la raiz del proyecto con tus credenciales de Firebase Console (Proyecto slinkter-ea443 u otro). Asegurate de que la API key no tenga restricciones bloqueando Firebase Installations, Auth y Firestore.",
    runtimeError: runtimeErrors.firebase,
  };

  // Evaluación de la API de Catálogo
  const catalogApiUrl = env.VITE_API_URL;
  const isCustomCatalogApi = Boolean(catalogApiUrl && catalogApiUrl.trim().length > 0);

  const catalogDiagnostic: IExternalServiceDiagnostic = {
    id: "catalogApi",
    name: "API de Catalogo de Productos",
    category: "Catalogo y Busqueda",
    status: isCustomCatalogApi ? "configured" : "fallback",
    isConfigured: true,
    requiredVars: ["VITE_API_URL"],
    missingVars: isCustomCatalogApi ? [] : ["VITE_API_URL"],
    summary: isCustomCatalogApi
      ? `Conectado a la API personalizada: ${catalogApiUrl}`
      : "Operando con la API por defecto (https://dummyjson.com).",
    impact: isCustomCatalogApi
      ? "Los productos se obtienen del endpoint especificado."
      : "Se utiliza el catalogo publico de DummyJSON como respaldo predeterminado.",
    remedy:
      "Si tienes tu propio backend de productos, define VITE_API_URL en el archivo .env. De lo contrario, no se requiere ninguna accion.",
    runtimeError: runtimeErrors.catalogApi,
  };

  const services = [firebaseDiagnostic, catalogDiagnostic];
  const hasIssues = services.some(
    (service) => service.status === "missing" || service.status === "invalid"
  );

  return {
    hasIssues,
    services,
  };
}
