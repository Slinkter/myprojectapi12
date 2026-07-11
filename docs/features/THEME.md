# Feature: Tema (Claro/Oscuro)

Gestión del tema de la aplicación con persistencia en `localStorage` y detección de preferencia del sistema.

---

## Estructura de Archivos

```
src/features/theme/
├── application/
│   └── ThemeContext.tsx          # Contexto + Provider + hook useTheme
├── infrastructure/
│   └── themeStorage.ts          # Persistencia y detección de tema
└── presentation/
    └── ThemeSwitcher.tsx        # Botón toggle con animación
```

## Tipos

```typescript
type Theme = "light" | "dark";

interface IThemeContextType {
  theme: Theme;
  toggleDarkMode: () => void;
}
```

## themeStorage (`themeStorage.ts`)

Servicio de infraestructura que abstrae el acceso a `localStorage` y la detección de preferencias del sistema:

```typescript
const THEME_STORAGE_KEY = "theme";

export const getStoredTheme = (): Theme => {
  // 1. Intentar obtener de localStorage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  // 2. Verificar preferencia del sistema
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  // 3. Fallback a light
  return "light";
};

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const applyThemeToDocument = (theme: Theme): void => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};
```

## ThemeContext (`ThemeContext.tsx`)

Provider que gestiona el estado del tema y lo sincroniza con el DOM:

```tsx
export const ThemeProvider = ({ children }: IThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleDarkMode = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleDarkMode }), [theme, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
```

### Hook useTheme

```typescript
export const useTheme = (): IThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};
```

## ThemeSwitcher (`ThemeSwitcher.tsx`)

Botón toggle con animación que alterna entre iconos de Sol y Luna:

- Usa `react-icons/hi2` para los iconos (`HiOutlineMoon`, `HiOutlineSun`)
- Animación de rotación y escala al cambiar de tema
- `aria-label` descriptivo: "Cambiar a modo oscuro/claro"
- Variante `ghost`, tamaño `icon` del componente `Button`

## Integración en la Aplicación

```tsx
// App.tsx
<ThemeProvider>
  <CartProvider>
    {/* ... */}
  </CartProvider>
</ThemeProvider>
```

Tailwind CSS v4 usa la clase `dark:` para variantes oscuras. El provider agrega/remueve la clase `dark` en `<html>`.
