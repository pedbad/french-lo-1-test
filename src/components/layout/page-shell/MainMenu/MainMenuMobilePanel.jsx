export const MainMenuMobilePanel = ({
  mobileMenuPanelId,
  mobileOpen,
  navEntries,
  menuHighlight,
  onNavClick,
}) => (
  <div
    id={mobileMenuPanelId}
    className={`mobile-menu ${mobileOpen ? "open" : ""}`}
    role="region"
    aria-label="Main navigation mobile"
    aria-hidden={!mobileOpen}
    // When closed the panel is aria-hidden; `inert` also pulls its links out of
    // the tab order and the AT tree, so focusable descendants can't be reached
    // (fixes axe "aria-hidden element contains focusable descendents").
    inert={!mobileOpen}
  >
    <ul className="mobile-menu-list">
      {navEntries.map((item) => {
        const highlight = menuHighlight === `menuItem-${item.id}`;
        return (
          <li key={`mobile-${item.id}`} className={highlight ? "highlight" : ""}>
            <a
              href={item.href}
              className="nav-link nav-link-mobile nav nav-scroll-link text-[var(--nav-link-size)]"
              onClick={onNavClick}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);
