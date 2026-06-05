import { IconButton } from "@/components/IconButton";
import { Menu, X } from "lucide-react";

const MenuToggleIcon = ({ mobileOpen }) => {
  const Icon = mobileOpen ? X : Menu;
  return <Icon aria-hidden="true" />;
};

export const MainMenuActions = ({
  mobileMenuPanelId,
  mobileOpen,
  onToggleMobileMenu,
  theme,
  toggleDark,
}) => (
  <div className="menu-actions">
    <IconButton
      className="size-9"
      variant="ghost"
      onClick={toggleDark}
      size="icon"
      theme={theme}
      title={
        theme === "moon"
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
    />
    <button
      type="button"
      className={`menu-toggle-button ${mobileOpen ? "is-open" : ""}`}
      aria-controls={mobileMenuPanelId}
      aria-label="Toggle navigation menu"
      aria-expanded={mobileOpen}
      onClick={onToggleMobileMenu}
    >
      <MenuToggleIcon mobileOpen={mobileOpen} />
    </button>
  </div>
);
