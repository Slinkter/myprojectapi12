/**
 * @file AuthActions.tsx
 * @description Controles de autenticación de la barra de navegación: email, rol,
 * accesos a admin/pedidos y botón de logout (o botón de login si no hay sesión).
 * @architecture Widget Layer - Auth Actions
 */

import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import { useAuth } from "@/features/auth/application/AuthContext";

/**
 * Props para el componente AuthActions.
 * @interface IAuthActionsProps
 */
interface IAuthActionsProps {
    /** Callback para abrir el modal de login cuando no hay sesión. */
    onLogin: () => void;
}

/**
 * @component AuthActions
 * @description Renderiza los controles de sesión. Con usuario autenticado muestra
 * email, badge de rol y accesos rápidos; sin sesión muestra un botón de login.
 *
 * @param {IAuthActionsProps} props - Props tipadas (ver {@link IAuthActionsProps}).
 * @returns {JSX.Element} Controles de autenticación.
 *
 * @example
 * <AuthActions onLogin={() => setIsLoginOpen(true)} />
 */
const AuthActions = ({ onLogin }: IAuthActionsProps) => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <IconButton onClick={onLogin} label="Iniciar sesión / Registrarse">
                <User size="18" />
            </IconButton>
        );
    }

    const roleClass =
        user.role === "admin"
            ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
            : "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800";

    const navPillClass =
        "no-underline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    return (
        <div className="flex items-center gap-1.5">
            <span
                className="hidden lg:inline text-xs font-semibold text-slate-500 max-w-[120px] truncate"
                title={user.email}
            >
                {user.email}
            </span>
            <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleClass}`}
            >
                {user.role === "admin" ? "Admin" : "Cliente"}
            </span>
            {user.role === "admin" && (
                <Link to="/admin" className={navPillClass}>
                    <div className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors text-red-700 dark:text-red-300">
                        Admin
                    </div>
                </Link>
            )}
            <Link to="/orders" className={navPillClass}>
                <div className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors text-slate-700 dark:text-slate-300">
                    {user.role === "admin" ? "Pedidos" : "Compras"}
                </div>
            </Link>
            <IconButton onClick={logout} label="Cerrar sesión">
                <LogOut size="18" className="text-red-500" />
            </IconButton>
        </div>
    );
};

export default AuthActions;