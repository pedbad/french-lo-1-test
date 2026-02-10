import "./MainMenu.scss";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { handleSpecialLinkClick } from "../../utility.js";
import { IconButton } from "..";
import React from "react";

export class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuHighlight: "menuItem-intro",
			mobileOpen: false,
		};
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
			const html = document.documentElement;
			const viewportHeight = window.innerHeight || html.clientHeight;

			const candidates = [];

			// 1. Intro
			const introEl = document.getElementById("special-anchor-intro");
			if (introEl) {
				const rect = introEl.getBoundingClientRect();
				// We only care that the top is below the menu and somewhere in the viewport
				if (rect.top >= mainMenuBottom && rect.top < viewportHeight) {
					candidates.push({
						key: "menuItem-intro",
						top: rect.top,
					});
				}
			}

			// 2. Config sections (including Monologues)
			for (const [, value] of Object.entries(config)) {
				const { id } = value;
				const target = document.getElementById(`special-anchor-${id}`);
				if (!target) continue;

				const rect = target.getBoundingClientRect();
				if (rect.top >= mainMenuBottom && rect.top < viewportHeight) {
					candidates.push({
						key: `menuItem-${id}`,
						top: rect.top,
					});
				}
			}

			// Pick the section whose top is closest to the menu
			if (candidates.length > 0) {
				candidates.sort((a, b) => a.top - b.top);
				const best = candidates[0].key;

				if (this.state.menuHighlight !== best) {
					this.setState({ menuHighlight: best });
				}
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
			if (window.innerWidth >= 768 && this.state.mobileOpen) {
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
   * Uses your existing handleSpecialLinkClick for smart scrolling,
   * and closes the mobile menu if it’s open.
   */
	handleNavClick = (e) => {
		// Use your global special link handler (handles preventDefault internally)
		handleSpecialLinkClick(e, { mode: "scroll" });

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
				const href = `#special-anchor-${id}`;

				// Desktop item
				topMenu.push(
					<NavigationMenuItem
						className={highlight ? "highlight" : ""}
						id={`menuItem-${id}`}
						key={`menuItem-${id}`}
					>
						<NavigationMenuLink asChild>
							<a
								className="special-anchor nav nav-link"
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
							className="nav-link nav-link-mobile nav special-anchor"
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

		const introHref = "#special-anchor-intro";

		return (
			<header className="main-menu" id="mainMenu">
				<NavigationMenu className="menu-root w-100">
					<div className="menu-flex">
						{/* LEFT — Title / brand */}
						<NavigationMenuList className="menu-left">
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<a
										className="special-anchor nav nav-title"
										href="#special-anchor-top"
										onClick={this.handleNavClick}
									>
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
										className="special-anchor nav nav-link"
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
								className="nav-link nav-link-mobile nav special-anchor"
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
