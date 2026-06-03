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
		<SidebarProvider
			defaultOpen={false}
			defaultOpenMobile={true}
			className="min-h-screen w-full bg-background"
		>
			{/* Left: course navigation. Sidebar root renders a <nav> landmark. */}
			<Sidebar collapsible="icon" className="border-r border-border">
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
								className="inline-flex size-[38px] items-center justify-center rounded-full border border-foreground bg-foreground text-(--footer-social-icon-fg) no-underline! transition-all duration-200 hover:-translate-y-0.5 hover:border-(--footer-hover-color) hover:bg-(--footer-hover-color)"
							>
								<Icon className="size-5" aria-hidden="true" strokeWidth={1.9} />
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
												className="text-sidebar-foreground! no-underline! hover:text-sidebar-foreground!"
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

				<SidebarFooter className="px-2 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
					<div className="flex items-center gap-2">
						<BookOpen className="size-4" aria-hidden="true" />
						<span>{learningObjects.length} objectives</span>
					</div>
				</SidebarFooter>
			</Sidebar>

			{/* Right: header band + card grid. (Plain div, not <main>/SidebarInset —
			    the app shell already provides the single <main> landmark.) */}
			<div className="relative flex min-w-0 flex-1 flex-col bg-background">
				{/* Slim decorative brand band — not a hero. */}
				<div className="relative isolate overflow-hidden border-b border-border">
					<img
						src={`${import.meta.env.BASE_URL}img/common/branding/fr-banner.svg`}
						alt=""
						aria-hidden="true"
						className="h-20 w-full object-cover object-[center_35%] sm:h-24"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
					<header className="absolute inset-0 flex items-center gap-3 px-4 sm:px-6">
						<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
							French&nbsp;Basic
						</h1>
					</header>
				</div>

				{/* Card grid. */}
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
									className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								>
									<Card className="flex h-full flex-col overflow-hidden border-t-2 border-t-[var(--brand-primary)] pt-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
										<CardHeader>
											<span
												aria-hidden="true"
												className="text-2xl font-bold tabular-nums text-(--brand-primary)/80"
											>
												{pad2(i + 1)}
											</span>
											<h3 className="text-base font-semibold leading-snug tracking-tight text-card-foreground">
												{lo.titleShort || lo.title}
											</h3>
										</CardHeader>
										<CardContent className="flex-1">
											<CardDescription className="line-clamp-3">
												{lo.title}
											</CardDescription>
										</CardContent>
										<CardFooter>
											<span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)]">
												Start
												<ArrowRight
													className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
	);
}
