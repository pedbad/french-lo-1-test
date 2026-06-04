import React from "react";
import { ArrowRight, BookOpen, Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";

const SOCIAL_LINKS = [
	{ href: "https://www.facebook.com/uclangcen/", icon: Facebook, label: "Facebook" },
	{ href: "https://x.com/uclangcen", icon: X, label: "X (Twitter)" },
	{ href: "https://www.youtube.com/cambridgeuniversity", icon: Youtube, label: "YouTube" },
	{ href: "https://www.linkedin.com/company/university-of-cambridge-language-centre/posts/?feedView=all", icon: Linkedin, label: "LinkedIn" },
	{ href: "https://www.instagram.com/cambridgeuniversity/", icon: Instagram, label: "Instagram" },
];

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const buildLearningObjectURL = (learningObject) => {
	const slug = `${learningObject?.slug || learningObject?.file || ""}`.trim();
	const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname;
	return `${basePath}${encodeURIComponent(slug)}/`;
};

const pad2 = (n) => String(n).padStart(2, "0");

export function LandingPage({ learningObjects = [] }) {
	if (learningObjects.length === 0) return null;

	return (
		// Full-bleed breakout: the landing renders inside #content (a centered,
		// max-width, padded column). This cancels that so the banner + sidebar
		// span the whole browser width like the other pages' shell.
		<div className="-mt-4 mx-[calc(50%-50vw)] w-screen">
			<SidebarProvider
				defaultOpen={false}
				defaultOpenMobile={true}
				className="relative w-full overflow-hidden bg-background"
			>
				{/* Sidebar: far-left of the content row. `absolute` keeps the rail
				    contained in this row, so it never overlaps the banner or footer. */}
				<Sidebar collapsible="icon" absolute className="border-r border-border">
				<SidebarHeader className="gap-1 px-2 py-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
							<span className="font-semibold">French Basic</span>
							<span className="text-xs text-white/70">Cambridge Language Centre</span>
						</span>
					</div>
				</SidebarHeader>

				<SidebarContent>
					{/* Collapsed rail: social links, stacked + vertically centered. */}
					<div
						role="group"
						aria-label="Follow us"
						className="hidden flex-1 flex-col items-center justify-center gap-4 group-data-[collapsible=icon]:flex"
					>
						{SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className="inline-flex size-6 items-center justify-center rounded-full border border-foreground bg-foreground text-(--footer-social-icon-fg) no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-(--footer-hover-color) hover:bg-(--footer-hover-color)"
							>
								<Icon className="size-3.5" aria-hidden="true" strokeWidth={1.9} />
							</a>
						))}
					</div>
					<nav aria-label="Learning objectives" className="group-data-[collapsible=icon]:hidden">
						<SidebarGroup>
							<SidebarGroupLabel>Learning objectives</SidebarGroupLabel>
							<SidebarMenu>
								{learningObjects.map((lo, i) => (
									<SidebarMenuItem key={lo.slug || i}>
										<SidebarMenuButton
											asChild
											tooltip={lo.titleShort || lo.title}
										>
											<a
												href={buildLearningObjectURL(lo)}
												className="text-sidebar-foreground no-underline hover:text-sidebar-foreground"
											>
												<span
													aria-hidden="true"
													className="flex size-5 shrink-0 items-center justify-center rounded text-[0.625rem] font-semibold tabular-nums text-white/85"
												>
													{pad2(i + 1)}
												</span>
												<span className="truncate">{lo.titleShort || lo.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>
					</nav>
				</SidebarContent>

				<SidebarFooter className="gap-1 px-1 py-3">
					{/* Expanded: objectives count */}
					<div className="flex items-center gap-2 px-1 text-xs text-white/70 group-data-[collapsible=icon]:hidden">
						<BookOpen className="size-4" aria-hidden="true" />
						<span>{learningObjects.length} objectives</span>
					</div>
					{/* Collapsed rail: tiny copyright below the social icons */}
					<p className="hidden whitespace-nowrap text-center text-[0.5rem] leading-none text-white/50 group-data-[collapsible=icon]:block">
						© 2026
					</p>
				</SidebarFooter>
			</Sidebar>

			{/* Right column: minimal teal header + card grid */}
			<div className="relative flex min-w-0 flex-1 flex-col bg-background">
				{/* Clean minimal header — brand teal, no illustration */}
				<header className="flex items-center border-b border-white/10 bg-(--brand-primary) px-6 py-4">
					<h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
						French&nbsp;Basic
					</h1>
					<span className="ml-3 text-sm text-white/60">
						Cambridge Language Centre
					</span>
				</header>

				<div className="px-4 py-6 sm:px-6">
					<h2 className="mb-5 text-lg font-semibold tracking-tight">
						Learning objectives
					</h2>
					<ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{learningObjects.map((lo, i) => (
							<li
								key={lo.slug || i}
								className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 motion-reduce:animate-none"
								style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
							>
								<a
									href={buildLearningObjectURL(lo)}
									className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								>
									<Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
										{/* Square illustration */}
										{lo.introImage && (
											<div className="aspect-square w-full overflow-hidden bg-(--brand-secondary)">
												<img
													src={`${import.meta.env.BASE_URL}${lo.introImage}`}
													alt=""
													aria-hidden="true"
													className="h-full w-full object-contain p-4"
												/>
											</div>
										)}
										<CardHeader className="pt-4">
											<span
												aria-hidden="true"
												className="text-xs font-semibold tabular-nums text-(--brand-primary)/70"
											>
												{pad2(i + 1)}
											</span>
											<h3 className="text-base font-semibold leading-snug tracking-tight text-card-foreground">
												{lo.titleShort || lo.title}
											</h3>
										</CardHeader>
										<CardContent className="flex-1 pt-0">
											<CardDescription className="line-clamp-2">
												{lo.title}
											</CardDescription>
										</CardContent>
										<CardFooter>
											<span className="inline-flex items-center gap-1 text-sm font-medium text-(--brand-primary)">
												Start
												<ArrowRight
													className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
													aria-hidden="true"
												/>
											</span>
										</CardFooter>
									</Card>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			</SidebarProvider>
		</div>
	);
}
