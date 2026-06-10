import React from "react";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { resolveAsset } from "@/utils/assets";
import { SOCIAL_LINKS } from "../socialLinks";

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


export function LandingPage({ learningObjects = [] }) {
  if (learningObjects.length === 0) return null;

  return (
  // Full-bleed breakout: the landing renders inside #content (a centered,
  // max-width, padded column). This cancels that so the banner + sidebar
  // span the whole browser width like the other pages' shell.
    <div className="-mt-4 mx-[calc(50%-50vw)] w-screen bg-(--page-background)">
      <SidebarProvider
        defaultOpen={false}
        defaultOpenMobile={true}
        className="relative w-full overflow-hidden bg-(--page-background)"
      >
        {/* Sidebar: far-left of the content row. `absolute` keeps the rail
				    contained in this row, so it never overlaps the banner or footer. */}
        <Sidebar collapsible="icon" absolute className="overflow-hidden rounded-br-2xl border-r border-border">
          <SidebarHeader className="gap-1 px-2 py-4">
            <SidebarTrigger className="-ml-1" />
          </SidebarHeader>

          <SidebarContent>
            {/* Collapsed rail: social links, stacked + vertically centered. */}
            <div
              role="group"
              aria-label="Follow us"
              className="hidden flex-col items-center gap-4 pt-32 group-data-[collapsible=icon]:flex"
            >
              {SOCIAL_LINKS.map(({ href, img, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-7 items-center justify-center rounded-md no-underline opacity-85 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <img
                    src={resolveAsset(img)}
                    alt=""
                    aria-hidden="true"
                    className="size-4 invert drop-shadow-sm"
                  />
                </a>
              ))}
            </div>
            <nav aria-label="Lessons" className="group-data-[collapsible=icon]:hidden">
              <SidebarGroup>
                <SidebarMenu>
                  {learningObjects.map((lo, i) => (
                    <SidebarMenuItem key={lo.slug || i}>
                      <SidebarMenuButton
                        asChild
                        tooltip={lo.titleShort || lo.title}
                      >
                        <a
                          href={buildLearningObjectURL(lo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sidebar-foreground no-underline hover:text-sidebar-foreground"
                        >
                          <span className="truncate">{lo.titleShort || lo.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </nav>
          </SidebarContent>
          {/* Gradient fade at sidebar bottom — softens the hard edge before the footer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-(--brand-quaternary) to-transparent"
          />

        </Sidebar>

        {/* Right column: header + card grid */}
        <div className="relative flex min-w-0 flex-1 flex-col bg-(--page-background)">
          {/* Landing header — uses its own classes, not #hero / .hero-title,
									    to avoid fighting the LO-page hero CSS rules. */}
          <header className="border-b border-border/50 px-6 py-6 sm:px-10 sm:py-8">
            <h1 className="landing-page-title">
									French&nbsp;Basic
            </h1>
            <div className="mt-4 border-l-2 border-[var(--brand-primary)]/30 pl-6">
              <h2 className="font-heading text-xl font-semibold text-(--brand-quaternary) sm:text-2xl">
											French Lessons
              </h2>
              <p className="mt-2 text-base leading-[var(--line-height-body)] text-(--brand-quaternary)">
										These lessons are small, independent resources that can be used either as part of a course or for self-study.
                <br />
										The lessons below are at basic level and concentrate on learning to speak, read and write French.
              </p>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6">
            <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {learningObjects.map((lo, i) => (
                <li
                  key={lo.slug || i}
                  className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 motion-reduce:animate-none"
                  style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
                >
                  <a
                    href={buildLearningObjectURL(lo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-xl no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card className="flex h-full flex-col overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--brand-primary)/30 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                      {/* Top Section: Image + Title Overlay */}
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-(--brand-secondary)/50">
                        {lo.introImage ? (
                          <img
                            src={`${import.meta.env.BASE_URL}${lo.introImage}`}
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="size-10 text-(--brand-primary)/20" />
                          </div>
                        )}

                        {/* Title Overlay with Cream Glass Effect (fades to right) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[var(--brand-secondary)]/95 via-[var(--brand-secondary)]/80 to-transparent px-4 py-2 backdrop-blur-[3px] border-t border-white/20">
                          <h3 className="font-heading text-base font-bold leading-tight text-(--brand-quaternary) sm:text-lg m-0">
                            {lo.titleShort || lo.title}
                          </h3>
                        </div>
                      </div>

                      <CardContent className="flex-1 pt-6">
                        <CardDescription className="max-h-[4.5rem] overflow-hidden text-sm font-normal leading-[var(--line-height-body-tight)] text-muted-foreground/90 transition-[max-height] duration-300 ease-in-out group-hover:max-h-40 motion-reduce:transition-none">
                          {lo.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
												Start Learning
                          <ExternalLink
                            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
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
