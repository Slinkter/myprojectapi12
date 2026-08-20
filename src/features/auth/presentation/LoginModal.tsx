/**
 * @file LoginModal.tsx
 * @description Modal de autenticación unificado (Login / Registro) con selección de rol.
 * @architecture Presentation Layer - Auth Component
 */

import { useState } from "react";
import { useAuth } from "@features/auth/application/AuthContext";
import { Mail, Lock, User, ShieldCheck, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/Button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login, signup } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "buyer">("buyer");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!agree) {
        setError("Debes aceptar los términos y confirmaciones para registrarte.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await signup(email, password, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      const firebaseError = err as { code?: string; message?: string };
      const code = firebaseError.code || "";
      if (code === "auth/email-already-in-use") {
        setError("El correo ya está registrado.");
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found" ||
        code === "auth/invalid-email"
      ) {
        setError("Credenciales incorrectas.");
      } else {
        setError(firebaseError.message || "Ocurrió un error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center min-h-screen">
      <div 
        aria-hidden="true" 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-[420px] w-full shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200 z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-transparent border-none cursor-pointer rounded-lg"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isRegister ? "Crear una Cuenta" : "Iniciar Sesión"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {isRegister ? "Regístrate para comprar o administrar productos" : "Accede a tus datos de e-commerce"}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <Mail size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 ${
                  error === "Credenciales incorrectas."
                    ? "border-red-500 dark:border-red-700 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30"
                }`}
                required
              />
            </div>
            {error === "Credenciales incorrectas." && (
              <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                Por favor, verifica tu dirección de correo electrónico.
              </span>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                className={`w-full h-11 pl-10 pr-11 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 ${
                  error === "Credenciales incorrectas."
                    ? "border-red-500 dark:border-red-700 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-transparent border-none cursor-pointer"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error === "Credenciales incorrectas." && (
              <span className="text-[10px] text-red-500 font-semibold mt-1 block">
                La contraseña introducida es incorrecta.
              </span>
            )}
          </div>

          {isRegister && (
            <>
              <div>
                <label htmlFor="login-confirm-password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-transparent border-none cursor-pointer"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <div className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Tipo de Usuario (Rol)
                </div>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <User size={15} />
                      Comprador
                    </div>
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={role === "buyer"}
                      onChange={() => setRole("buyer")}
                      className="accent-emerald-600"
                    />
                  </label>

                  <label className="flex-1 flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} />
                      Admin
                    </div>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                      className="accent-emerald-600"
                    />
                  </label>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 accent-emerald-600"
                />
                <span>Confirmo y acepto registrarme en la plataforma y compartir mi correo electrónico.</span>
              </label>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            {loading ? "Procesando..." : isRegister ? "Registrarse" : "Acceder"}
          </Button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-none cursor-pointer"
          >
            {isRegister ? "¿Ya tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate aquí"}
          </button>
        </div>
      </div>
    </div>
  );
};
