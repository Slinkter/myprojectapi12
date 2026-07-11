import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/application/CartContext";
import { useTheme } from "@/features/theme/application/ThemeContext";
import { useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";
import {
  Search,
  X,
  Sun,
  Moon,
  ShoppingBag,
  Menu,
  ChevronDown,
} from "lucide-react";

/* ─── Logo ─────────────────────────────────────────── */
const NavLogo = () => (
  <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
    <m.div
      whileHover={{ rotate: -8, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-[0_4px_12px_rgba(5,150,105,0.25)] shrink-0"
    >
      <ShoppingBag size="18" className="text-white" />
    </m.div>
    <div className="flex flex-col">
      <span className="text-lg font-extrabold tracking-tight leading-none text-slate-800 dark:text-slate-100">
        Shop<span className="text-primary transition-colors group-hover:text-primary-hover">API</span>
      </span>
      <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5">
        E-Commerce
      </span>
    </div>
  </Link>
);

/* ─── NavLink ───────────────────────────────────────── */
const NavLink = ({
  to,
  active,
  children,
  onClick,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link to={to} className="no-underline" onClick={onClick}>
    <m.div
      whileHover={{ backgroundColor: "rgba(5, 150, 105, 0.08)" }}
      className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer relative flex items-center min-h-[36px] ${
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-slate-600 dark:text-slate-300"
      }`}
      transition={{ duration: 0.15 }}
    >
      {children}
      {active && (
        <m.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-[20%] right-[20%] h-0.5 rounded-t-full bg-primary"
        />
      )}
    </m.div>
  </Link>
);

/* ─── Icon Action Button ────────────────────────────── */
const ActionBtn = ({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <m.button
    type="button"
    onClick={onClick}
    aria-label={label}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(15, 23, 42, 0.06)" }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center w-10 h-10 rounded-full border-none bg-transparent cursor-pointer text-slate-600 dark:text-slate-300 dark:hover:bg-white/10 shrink-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    transition={{ duration: 0.15 }}
  >
    {children}
  </m.button>
);

/* ─── Main Navbar ───────────────────────────────────── */
const Navbar = () => {
  useLogLifecycle("Navbar");

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, openCart } = useCart();
  const { theme, toggleDarkMode } = useTheme();
  const { data: categories, isLoading } = useCategories();

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const isHome = location.pathname === "/" && !location.search;
  const isCatActive = location.pathname === "/" && !!location.search;

  const handleCategorySelect = (slug: string | null) => {
    setIsMobileOpen(false);
    setIsCatOpen(false);
    navigate(slug ? `/?category=${slug}` : "/");
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchVal("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    navigate("/");
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('[aria-label="Buscar productos"]');
      if (input) {
        input.value = searchVal;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      }
    }, 100);
    closeSearch();
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* ── Logo ── */}
        <NavLogo />

        {/* ── Desktop Nav (center) ── */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-grow">
          <AnimatePresence mode="wait">
            {!isSearchOpen && (
              <m.div
                key="desktop-links"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center gap-1"
              >
                <NavLink to="/" active={isHome}>Inicio</NavLink>

                {/* Categories Dropdown */}
                <div className="relative">
                  <m.button
                    type="button"
                    onClick={() => setIsCatOpen(!isCatOpen)}
                    whileHover={{ backgroundColor: "rgba(5, 150, 105, 0.08)" }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold tracking-wide border-none cursor-pointer transition-all min-h-[36px] ${
                      isCatActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isCatOpen}
                    transition={{ duration: 0.15 }}
                  >
                    Categorías
                    <m.span animate={{ rotate: isCatOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size="14" />
                    </m.span>
                  </m.button>

                  {/* Dropdown Panel */}
                  <AnimatePresence>
                    {isCatOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-49"
                          onClick={() => setIsCatOpen(false)}
                        />
                        <m.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl p-2 min-w-[220px] max-h-[360px] overflow-y-auto"
                          role="listbox"
                          aria-label="Categorías de productos"
                        >
                          <button
                            type="button"
                            onClick={() => handleCategorySelect(null)}
                            className="w-full text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                          >
                            🏠 Todas las categorías
                          </button>
                          <div className="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 my-1 mx-2" />
                          {isLoading ? (
                            <span className="block px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs">
                              Cargando…
                            </span>
                          ) : (
                            categories?.map((cat) => (
                              <button
                                key={cat.slug}
                                type="button"
                                onClick={() => handleCategorySelect(cat.slug)}
                                className="w-full text-left px-4 py-2 rounded-xl border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-capitalize transition-colors"
                              >
                                {cat.name}
                              </button>
                            ))
                          )}
                        </m.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Actions (right) ── */}
        <div className="flex items-center gap-1">
          {/* Search — expandible */}
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <m.form
                key="search-open"
                onSubmit={handleSearchSubmit}
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full border border-primary px-3 overflow-hidden h-10"
              >
                <Search size="16" className="text-primary shrink-0" />
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Buscar productos…"
                  className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full"
                  aria-label="Buscar"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="bg-none border-none cursor-pointer flex text-slate-500 dark:text-slate-400 shrink-0"
                >
                  <X size="14" />
                </button>
              </m.form>
            ) : (
              <m.div key="search-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ActionBtn onClick={openSearch} label="Buscar productos">
                  <Search size="20" />
                </ActionBtn>
              </m.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <ActionBtn onClick={toggleDarkMode} label={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <m.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size="20" className="text-amber-500" />
                </m.span>
              ) : (
                <m.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size="20" />
                </m.span>
              )}
            </AnimatePresence>
          </ActionBtn>

          {/* Cart Button */}
          <div className="relative">
            <ActionBtn onClick={openCart} label={`Carrito${totalItems > 0 ? ` — ${totalItems} artículos` : ""}`}>
              <ShoppingBag size="20" />
            </ActionBtn>
            <AnimatePresence>
              {totalItems > 0 && (
                <m.div
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute top-0 right-0 w-[19px] h-[19px] rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 pointer-events-none"
                  aria-hidden="true"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <div className="block md:hidden">
            <ActionBtn
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <m.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size="18" />
                  </m.span>
                ) : (
                  <m.span key="burger" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size="18" />
                  </m.span>
                )}
              </AnimatePresence>
            </ActionBtn>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 md:hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              <NavLink to="/" active={isHome} onClick={() => setIsMobileOpen(false)}>
                Inicio
              </NavLink>

              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 py-2.5 mt-2">
                Categorías
              </span>

              <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pl-2">
                <button
                  type="button"
                  onClick={() => handleCategorySelect(null)}
                  className="text-left px-4 py-2 rounded-full border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  Todas las categorías
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className="text-left px-4 py-2 rounded-full border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-capitalize tracking-widest transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
