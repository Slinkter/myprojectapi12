import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/features/cart/application/CartContext";
import { useTheme } from "@/features/theme/application/ThemeContext";
import { useLogLifecycle } from "@/shared/hooks";
import {
  Box,
  Flex,
  Container,
  Heading,
  IconButton,
  Badge,
  TextField,
  Button as RadixButton,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  SunIcon,
  MoonIcon,
  BackpackIcon,
} from "@radix-ui/react-icons";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/checkout", label: "Checkout" },
];

const Navbar = () => {
  useLogLifecycle("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  const { theme, toggleDarkMode } = useTheme();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      asChild
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--gray-4)",
        backgroundColor: "var(--color-background)",
      }}
    >
      <header>
        <Container size="3" px="4">
          <Flex justify="between" align="center" height="56px">
            {/* Logo */}
            <Heading size="4" weight="bold">
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                API-12
              </Link>
            </Heading>

            {/* Desktop Navigation */}
            <Flex gap="2" display={{ initial: "none", md: "flex" }} align="center">
              {navLinks.map(({ href, label }) => (
                <RadixButton
                  key={href}
                  variant={isActive(href) ? "soft" : "ghost"}
                  color="purple"
                  asChild
                >
                  <Link to={href}>{label}</Link>
                </RadixButton>
              ))}
            </Flex>

            {/* Actions */}
            <Flex gap="2" align="center">
              {/* Search Toggle */}
              <IconButton
                variant="ghost"
                color="gray"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Buscar"
                size="3"
              >
                <MagnifyingGlassIcon width="20" height="20" />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton
                variant="ghost"
                color="gray"
                onClick={toggleDarkMode}
                aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
                size="3"
              >
                {theme === "dark" ? (
                  <SunIcon width="20" height="20" style={{ color: "var(--amber-9)" }} />
                ) : (
                  <MoonIcon width="20" height="20" />
                )}
              </IconButton>

              {/* Cart Link */}
              <IconButton
                variant="ghost"
                color="gray"
                asChild
                size="3"
              >
                <Link to="/checkout" style={{ position: "relative" }}>
                  <BackpackIcon width="20" height="20" />
                  {totalItems > 0 && (
                    <Badge
                      color="purple"
                      variant="solid"
                      radius="full"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                      }}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </Link>
              </IconButton>

              {/* Mobile Menu Toggle */}
              <Box display={{ initial: "block", md: "none" }} asChild>
                <IconButton
                  variant="ghost"
                  color="gray"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                  size="3"
                >
                  {isMobileMenuOpen ? (
                    <Cross1Icon width="20" height="20" />
                  ) : (
                    <HamburgerMenuIcon width="20" height="20" />
                  )}
                </IconButton>
              </Box>
            </Flex>
          </Flex>
        </Container>

        {/* Search Input Area */}
        {isSearchOpen && (
          <Box p="4" style={{ borderTop: "1px solid var(--gray-4)" }}>
            <Container size="3">
              <Box style={{ maxWidth: "600px" }} mx="auto">
                <TextField.Root placeholder="Buscar productos..." size="3" aria-label="Buscar productos">
                  <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            </Container>
          </Box>
        )}

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <Box
            p="3"
            display={{ md: "none" }}
            style={{ borderTop: "1px solid var(--gray-4)", backgroundColor: "var(--color-background)" }}
          >
            <Flex direction="column" gap="1">
              {navLinks.map(({ href, label }) => (
                <RadixButton
                  key={href}
                  variant={isActive(href) ? "soft" : "ghost"}
                  color="purple"
                  onClick={() => setIsMobileMenuOpen(false)}
                  asChild
                  style={{ justifyContent: "flex-start" }}
                >
                  <Link to={href}>{label}</Link>
                </RadixButton>
              ))}
            </Flex>
          </Box>
        )}
      </header>
    </Box>
  );
};

export default Navbar;

