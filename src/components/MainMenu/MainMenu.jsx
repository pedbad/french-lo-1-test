import "./MainMenu.scss";
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
			menuHighlight: "menuItem-intro",
			mobileOpen: false,
		};
		this.pendingNavTarget = null;
		window.__lastKnownScrollPosition = 0;
	}

	componentDidMount = () => {
		// Helper: choose the section whose heading is just below the menu
		const updateHighlight = () => {
			const { config } = this.props;
			const mainMenu = document.getElementById("mainMenu");
			if (!mainMenu || !config) return;

			const mainMenuRect = mainMenu.getBoundingClientRect();
			const mainMenuBottom = mainMenuRect.bottom;
			// A heading becomes "active" only once it reaches this line.
			// This prevents intro from highlighting while the hero banner is still in view.
			const activationLine = mainMenuBottom + 140;
			const passed = [];

			// While smooth-scrolling from a nav click, keep the clicked section active
			// until its heading reaches the activation line.
			if (this.pendingNavTarget) {
				const pendingTarget = document.getElementById(
					`modal-link-${this.pendingNavTarget}`
				);
				if (pendingTarget) {
					const pendingRect = pendingTarget.getBoundingClientRect();
					if (pendingRect.top > activationLine + 8) {
						const pendingKey =
							this.pendingNavTarget === "intro"
								? "menuItem-intro"
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
			const introEl = document.getElementById("modal-link-intro");
			if (introEl) {
				const rect = introEl.getBoundingClientRect();
				if (rect.top <= activationLine) {
					passed.push({
						key: "menuItem-intro",
						top: rect.top,
					});
				}
			}

			// 2. Config sections (including Monologues)
			for (const [, value] of Object.entries(config)) {
				const { id } = value;
				const target = document.getElementById(`modal-link-${id}`);
				if (!target) continue;

				const rect = target.getBoundingClientRect();
				if (rect.top <= activationLine) {
					passed.push({
						key: `menuItem-${id}`,
						top: rect.top,
					});
				}
			}

			// Pick the heading closest to the activation line from above.
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
			if (window.innerWidth >= 1000 && this.state.mobileOpen) {
				this.setState({ mobileOpen: false });
			}
			// Recalculate which section is "current"
			updateHighlight();
		};

		window.addEventListener("resize", this.resizeHandler);

		// Initial highlight on mount
		updateHighlight();
	};

	componentWillUnmount() {
		document.removeEventListener("scroll", this.scrollHandler);
		window.removeEventListener("resize", this.resizeHandler);
	}

	toggleMobileMenu = () => {
		this.setState((prev) => ({ mobileOpen: !prev.mobileOpen }));
	};

	/**
   * Shared nav click handler for desktop + mobile.
   * Uses your existing handleModalLinkClick for smart scrolling,
   * and closes the mobile menu if it’s open.
   */
	handleNavClick = (e) => {
		const href = e.currentTarget?.getAttribute("href") || "";
		if (href.startsWith("#modal-link-")) {
			const rawId = href.replace("#modal-link-", "");
			if (rawId === "top") {
				this.pendingNavTarget = null;
				if (this.state.menuHighlight !== null) {
					this.setState({ menuHighlight: null });
				}
			} else {
				this.pendingNavTarget = rawId;
				const nextHighlight =
					rawId === "intro" ? "menuItem-intro" : `menuItem-${rawId}`;
				if (this.state.menuHighlight !== nextHighlight) {
					this.setState({ menuHighlight: nextHighlight });
				}
			}
		}

		// Use your global modal link handler (handles preventDefault internally)
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

		const introHighlight = menuHighlight === "menuItem-intro";

		const topMenu = [];
		const mobileMenuItems = [];

		for (const [, value] of Object.entries(config)) {
			const { component, menuText, titleText, id } = value;

			if (component) {
				const highlight = menuHighlight === `menuItem-${id}`;
				const label = menuText ? menuText : titleText;
				const href = `#modal-link-${id}`;

				// Desktop item
				topMenu.push(
					<NavigationMenuItem
						className={highlight ? "highlight" : ""}
						id={`menuItem-${id}`}
						key={`menuItem-${id}`}
					>
						<NavigationMenuLink asChild>
							<a
								className="modal-link nav nav-link"
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
							className="nav-link nav-link-mobile nav modal-link"
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

		const introHref = "#modal-link-intro";

		return (
			<header className="main-menu" id="mainMenu">
				<NavigationMenu className="menu-root w-100">
					<div className="menu-flex">
						{/* LEFT — Title / brand */}
						<NavigationMenuList className="menu-left">
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<a
										className="modal-link nav nav-title"
										href="#modal-link-top"
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
								id="menu-item-intro"
								key="menu-item-intro"
							>
								<NavigationMenuLink asChild>
									<a
										className="modal-link nav nav-link"
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

				{/* MOBILE DROPDOWN NAV */}
				<nav
					className={`mobile-menu ${mobileOpen ? "open" : ""}`}
					aria-label="Main navigation mobile"
				>
					<ul className="mobile-menu-list">
						<li className={introHighlight ? "highlight" : ""}>
							<a
								href={introHref}
								className="nav-link nav-link-mobile nav modal-link"
								onClick={this.handleNavClick}
							>
								Introduction
							</a>
						</li>
						{mobileMenuItems}
					</ul>
				</nav>
			</header>
		);
	};
}
