import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MessageCircleMore } from "lucide-react";
import { handleModalLinkClick } from "../../utility.js";
import { IconButton } from "..";
import React from "react";

export class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuHighlight: "menuItem-introduction",
			mobileOpen: false,
		};
		this.mobileMenuPanelId = "main-navigation-mobile-panel";
		this.pendingNavTarget = null;
		window.__lastKnownScrollPosition = 0;
	}

		componentDidMount = () => {
			// Helper: choose the section whose top is just below the menu
		const updateHighlight = () => {
			const { config } = this.props;
			const mainMenu = document.getElementById("mainMenu");
			if (!mainMenu || !config) return;

			const mainMenuRect = mainMenu.getBoundingClientRect();
			const mainMenuBottom = mainMenuRect.bottom;
				// A section becomes "active" only once it reaches this line.
			// This prevents intro from highlighting while the hero banner is still in view.
			const activationLine = mainMenuBottom + 140;
			const passed = [];

			// While smooth-scrolling from a nav click, keep the clicked section active
			// until its top reaches the activation line.
			if (this.pendingNavTarget) {
				const pendingTarget = document.getElementById(this.pendingNavTarget);
				if (pendingTarget) {
					const pendingRect = pendingTarget.getBoundingClientRect();
					if (pendingRect.top > activationLine + 8) {
						const pendingKey =
								this.pendingNavTarget === "introduction"
									? "menuItem-introduction"
									: `menuItem-${this.pendingNavTarget}`;
						if (this.state.menuHighlight !== pendingKey) {
							this.setState({ menuHighlight: pendingKey });
						}
						return;
					}
				}
				this.pendingNavTarget = null;
			}

			// 1. Intro
			const introEl = document.getElementById("introduction");
			if (introEl) {
				const rect = introEl.getBoundingClientRect();
				if (rect.top <= activationLine) {
					passed.push({
						key: "menuItem-introduction",
						top: rect.top,
					});
				}
			}

			// 2. Config sections (including Monologues)
			for (const [, value] of Object.entries(config)) {
				const { id } = value;
				const target = document.getElementById(id);
				if (!target) continue;

				const rect = target.getBoundingClientRect();
				if (rect.top <= activationLine) {
					passed.push({
						key: `menuItem-${id}`,
						top: rect.top,
					});
				}
			}

				// Pick the section closest to the activation line from above.
			passed.sort((a, b) => b.top - a.top);
			const best = passed.length > 0 ? passed[0].key : null;

			if (this.state.menuHighlight !== best) {
				this.setState({ menuHighlight: best });
			}
		};

		let running = false;

		this.scrollHandler = () => {
			window.__lastKnownScrollPosition = window.scrollY;

			if (running) return;
			running = true;

			setTimeout(() => {
				updateHighlight();
				running = false;
			}, 200); // throttle
		};

		document.addEventListener("scroll", this.scrollHandler, {
			passive: true,
		});

		this.resizeHandler = () => {
			// If we resize up to desktop, close mobile menu
			if (window.innerWidth >= 1200 && this.state.mobileOpen) {
				this.setState({ mobileOpen: false });
			}
			// Recalculate which section is "current"
			updateHighlight();
		};

		window.addEventListener("resize", this.resizeHandler);

		this.keydownHandler = (event) => {
			if (event.key === "Escape" && this.state.mobileOpen) {
				this.setState({ mobileOpen: false });
			}
		};
		document.addEventListener("keydown", this.keydownHandler);

		// Initial highlight on mount
		updateHighlight();
	};

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
			} else {
				this.pendingNavTarget = rawId;
				const nextHighlight =
					rawId === "introduction" ? "menuItem-introduction" : `menuItem-${rawId}`;
				if (this.state.menuHighlight !== nextHighlight) {
					this.setState({ menuHighlight: nextHighlight });
				}
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

		const introHighlight = menuHighlight === "menuItem-introduction";

		const topMenu = [];
		const mobileMenuItems = [];

		for (const [, value] of Object.entries(config)) {
			const { component, menuText, titleText, id } = value;

			if (component) {
				const highlight = menuHighlight === `menuItem-${id}`;
				const label = menuText ? menuText : titleText;
				const href = `#${id}`;

				// Desktop item
				topMenu.push(
					<NavigationMenuItem
						className={highlight ? "highlight" : ""}
						id={`menuItem-${id}`}
						key={`menuItem-${id}`}
					>
						<NavigationMenuLink asChild>
							<a
								className="nav-scroll-link nav nav-link text-[var(--nav-link-size)]"
								href={href}
								onClick={this.handleNavClick}
							>
								{label}
							</a>
						</NavigationMenuLink>
					</NavigationMenuItem>
				);

				// Mobile item
				mobileMenuItems.push(
					<li key={`mobile-${id}`} className={highlight ? "highlight" : ""}>
						<a
							href={href}
							className="nav-link nav-link-mobile nav nav-scroll-link text-[var(--nav-link-size)]"
							onClick={this.handleNavClick}
						>
							{label}
						</a>
					</li>
				);
			}
		}

		let theme = "moon"; // Going from light to dark hence moon
		if (typeof document !== "undefined") {
			if (document.documentElement.classList.contains("dark")) {
				theme = "sun";
			}
		}

		const introHref = "#introduction";

		return (
			<header className="main-menu" id="mainMenu">
				<NavigationMenu className="menu-root w-full">
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
										{title}
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>

						{/* DESKTOP — Right-hand nav */}
						<NavigationMenuList className="menu-right">
							<NavigationMenuItem
								className={introHighlight ? "highlight" : ""}
								id="menu-item-introduction"
								key="menu-item-introduction"
							>
								<NavigationMenuLink asChild>
									<a
										className="nav-scroll-link nav nav-link text-[var(--nav-link-size)]"
										href={introHref}
										onClick={this.handleNavClick}
									>
										Introduction
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>

							{topMenu}
						</NavigationMenuList>

						{/* RIGHT — Actions: theme toggle + hamburger */}
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
								className={`menu-toggle-button ${
									mobileOpen ? "is-open" : ""
								}`}
								aria-controls={this.mobileMenuPanelId}
								aria-label="Toggle navigation menu"
								aria-expanded={mobileOpen}
								onClick={this.toggleMobileMenu}
							>
								{/* Hamburger / close icon */}
								{!mobileOpen ? (
								// Hamburger
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								) : (
								// Close
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M6 6l12 12M18 6L6 18" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</NavigationMenu>

				{/* MOBILE DROPDOWN PANEL (same IA, not a second primary nav landmark) */}
				<div
					id={this.mobileMenuPanelId}
					className={`mobile-menu ${mobileOpen ? "open" : ""}`}
					role="region"
					aria-label="Main navigation mobile"
					aria-hidden={!mobileOpen}
				>
					<ul className="mobile-menu-list">
						<li className={introHighlight ? "highlight" : ""}>
							<a
								href={introHref}
								className="nav-link nav-link-mobile nav nav-scroll-link text-[var(--nav-link-size)]"
								onClick={this.handleNavClick}
							>
								Introduction
							</a>
						</li>
						{mobileMenuItems}
					</ul>
				</div>
			</header>
		);
	};
}
