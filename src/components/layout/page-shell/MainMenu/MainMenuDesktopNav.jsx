import {
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const MainMenuDesktopNav = ({ navEntries, menuHighlight, onNavClick }) => (
	<NavigationMenuList className="menu-right">
		{navEntries.map((item) => {
			const highlight = menuHighlight === `menuItem-${item.id}`;
			return (
				<NavigationMenuItem
					className={highlight ? "highlight" : ""}
					id={`menuItem-${item.id}`}
					key={`menuItem-${item.id}`}
				>
					<NavigationMenuLink asChild>
						<a
							className="nav-scroll-link nav nav-link text-[var(--nav-link-size)]"
							href={item.href}
							onClick={onNavClick}
						>
							{item.label}
						</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			);
		})}
	</NavigationMenuList>
);
