import { useCallback, useEffect, useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { handleModalLinkClick } from "@/utils/dom";
import { MessageCircleMore } from "lucide-react";
import { MainMenuActions } from "./MainMenuActions";
import { MainMenuDesktopNav } from "./MainMenuDesktopNav";
import { MainMenuMobilePanel } from "./MainMenuMobilePanel";
import { getMainMenuNavEntries } from "./navEntries";
import {
  getMenuHighlightKey,
  resolveMainMenuHighlight,
} from "./useMainMenuHighlight";

const MOBILE_MENU_PANEL_ID = "main-navigation-mobile-panel";
const DESKTOP_BREAKPOINT = 1150;
const SCROLL_THROTTLE_MS = 200;

export function MainMenu({ config, title, toggleDark }) {
  const [menuHighlight, setMenuHighlight] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingNavTargetRef = useRef(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const updateHighlight = useCallback(() => {
    const { menuHighlight: nextHighlight, pendingNavTarget } = resolveMainMenuHighlight({
      config: configRef.current,
      pendingNavTarget: pendingNavTargetRef.current,
    });

    pendingNavTargetRef.current = pendingNavTarget;
    setMenuHighlight((prev) => (prev !== nextHighlight ? nextHighlight : prev));
  }, []);

  // Listener setup/teardown (componentDidMount + componentWillUnmount).
  useEffect(() => {
    let running = false;

    const scrollHandler = () => {
      if (running) return;
      running = true;
      setTimeout(() => {
        updateHighlight();
        running = false;
      }, SCROLL_THROTTLE_MS);
    };
    document.addEventListener("scroll", scrollHandler, { passive: true });

    const resizeHandler = () => {
      // If we resize up to desktop, close mobile menu
      setMobileOpen((prev) => (window.innerWidth >= DESKTOP_BREAKPOINT && prev ? false : prev));
      // Recalculate which section is "current"
      updateHighlight();
    };
    window.addEventListener("resize", resizeHandler);

    const keydownHandler = (event) => {
      if (event.key === "Escape") {
        setMobileOpen((prev) => (prev ? false : prev));
      }
    };
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
      document.removeEventListener("keydown", keydownHandler);
    };
  }, [updateHighlight]);

  // Initial highlight on mount + when config changes (componentDidUpdate).
  useEffect(() => {
    updateHighlight();
  }, [config, updateHighlight]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  /**
   * Shared nav click handler for desktop + mobile.
   * Uses shared link handling in explicit scroll mode,
   * and closes the mobile menu if it's open.
   */
  const handleNavClick = useCallback((e) => {
    const href = e.currentTarget?.getAttribute("href") || "";
    if (href.startsWith("#")) {
      const rawId = href.slice(1);
      if (rawId === "content") {
        pendingNavTargetRef.current = null;
        setMenuHighlight((prev) => (prev !== null ? null : prev));
        // Clear hash when navigating back to top
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        pendingNavTargetRef.current = rawId;
        const nextHighlight = getMenuHighlightKey(rawId);
        setMenuHighlight((prev) => (prev !== nextHighlight ? nextHighlight : prev));
        // Keep URL hash in sync with the nav section being visited
        window.history.replaceState(null, "", `#${rawId}`);
      }
    }

    // Main navigation is scroll-only (never modal).
    handleModalLinkClick(e, { mode: "scroll" });

    // Close mobile menu if open
    setMobileOpen((prev) => (prev ? false : prev));
  }, []);

  if (!config) return null;

  const navEntries = getMainMenuNavEntries(config);

  let theme = "moon"; // Going from light to dark hence moon
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      theme = "sun";
    }
  }

  return (
    <header className="main-menu" id="mainMenu">
      <NavigationMenu aria-label="Main navigation" className="menu-root w-full">
        <div className="menu-flex">
          {/* LEFT — Title / brand */}
          <NavigationMenuList className="menu-left">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  className="nav-scroll-link nav nav-title text-[var(--nav-title-size)] font-semibold"
                  href="#content"
                  onClick={handleNavClick}
                >
                  <MessageCircleMore aria-hidden="true" className="nav-title-icon" />
                  <span className="nav-title-text">{title}</span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <MainMenuDesktopNav
            navEntries={navEntries}
            menuHighlight={menuHighlight}
            onNavClick={handleNavClick}
          />

          <MainMenuActions
            mobileMenuPanelId={MOBILE_MENU_PANEL_ID}
            mobileOpen={mobileOpen}
            onToggleMobileMenu={toggleMobileMenu}
            theme={theme}
            toggleDark={toggleDark}
          />
        </div>
      </NavigationMenu>

      <MainMenuMobilePanel
        mobileMenuPanelId={MOBILE_MENU_PANEL_ID}
        mobileOpen={mobileOpen}
        navEntries={navEntries}
        menuHighlight={menuHighlight}
        onNavClick={handleNavClick}
      />
    </header>
  );
}
