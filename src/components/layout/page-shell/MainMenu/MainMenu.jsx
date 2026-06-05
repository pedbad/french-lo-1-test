import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { handleModalLinkClick } from "@/utils/dom";
import { MessageCircleMore } from "lucide-react";
import React from "react";
import { MainMenuActions } from "./MainMenuActions";
import { MainMenuDesktopNav } from "./MainMenuDesktopNav";
import { MainMenuMobilePanel } from "./MainMenuMobilePanel";
import { getMainMenuNavEntries } from "./navEntries";
import {
  getMenuHighlightKey,
  resolveMainMenuHighlight,
} from "./useMainMenuHighlight";

export class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHighlight: null,
      mobileOpen: false,
    };
    this.mobileMenuPanelId = "main-navigation-mobile-panel";
    this.pendingNavTarget = null;
  }

  componentDidMount = () => {
    this.updateHighlight = () => {
      const { config } = this.props;
      const { menuHighlight, pendingNavTarget } = resolveMainMenuHighlight({
        config,
        pendingNavTarget: this.pendingNavTarget,
      });

      this.pendingNavTarget = pendingNavTarget;
      if (this.state.menuHighlight !== menuHighlight) {
        this.setState({ menuHighlight });
      }
    };

    let running = false;

    this.scrollHandler = () => {
      if (running) return;
      running = true;

      setTimeout(() => {
        this.updateHighlight();
        running = false;
      }, 200); // throttle
    };

    document.addEventListener("scroll", this.scrollHandler, {
      passive: true,
    });

    this.resizeHandler = () => {
      // If we resize up to desktop, close mobile menu
      if (window.innerWidth >= 1150 && this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
      // Recalculate which section is "current"
      this.updateHighlight();
    };

    window.addEventListener("resize", this.resizeHandler);

    this.keydownHandler = (event) => {
      if (event.key === "Escape" && this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    };
    document.addEventListener("keydown", this.keydownHandler);

    // Initial highlight on mount
    this.updateHighlight();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.config !== this.props.config && typeof this.updateHighlight === "function") {
      this.updateHighlight();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("resize", this.resizeHandler);
    document.removeEventListener("keydown", this.keydownHandler);
  }

  toggleMobileMenu = () => {
    this.setState((prev) => ({ mobileOpen: !prev.mobileOpen }));
  };

  /**
   * Shared nav click handler for desktop + mobile.
   * Uses shared link handling in explicit scroll mode,
   * and closes the mobile menu if it’s open.
   */
  handleNavClick = (e) => {
    const href = e.currentTarget?.getAttribute("href") || "";
    if (href.startsWith("#")) {
      const rawId = href.slice(1);
      if (rawId === "content") {
        this.pendingNavTarget = null;
        if (this.state.menuHighlight !== null) {
          this.setState({ menuHighlight: null });
        }
        // Clear hash when navigating back to top
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        this.pendingNavTarget = rawId;
        const nextHighlight = getMenuHighlightKey(rawId);
        if (this.state.menuHighlight !== nextHighlight) {
          this.setState({ menuHighlight: nextHighlight });
        }
        // Keep URL hash in sync with the nav section being visited
        window.history.replaceState(null, "", `#${rawId}`);
      }
    }

    // Main navigation is scroll-only (never modal).
    handleModalLinkClick(e, { mode: "scroll" });

    // Close mobile menu if open
    if (this.state.mobileOpen) {
      this.setState({ mobileOpen: false });
    }
  };

  render = () => {
    const { config, title, toggleDark } = this.props;
    const { menuHighlight, mobileOpen } = this.state;

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
                    onClick={this.handleNavClick}
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
              onNavClick={this.handleNavClick}
            />

            <MainMenuActions
              mobileMenuPanelId={this.mobileMenuPanelId}
              mobileOpen={mobileOpen}
              onToggleMobileMenu={this.toggleMobileMenu}
              theme={theme}
              toggleDark={toggleDark}
            />
          </div>
        </NavigationMenu>

        <MainMenuMobilePanel
          mobileMenuPanelId={this.mobileMenuPanelId}
          mobileOpen={mobileOpen}
          navEntries={navEntries}
          menuHighlight={menuHighlight}
          onNavClick={this.handleNavClick}
        />
      </header>
    );
  };
}
