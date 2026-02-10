// src/components/ui/tooltip.jsx
// shadcn-style Tooltip wrapper built on Radix Tooltip.
// This keeps tooltip styling aligned with our Tailwind tokens (bg-popover, text-popover-foreground, border-border-subtle),
// so light/dark theming stays consistent.

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

// Provider should wrap the app once so delay/behavior is consistent across tooltips.
const TooltipProvider = TooltipPrimitive.Provider;

// Root/Trigger/Content mirror the shadcn component API for consistency.
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
	({ className, sideOffset = 8, ...props }, ref) => (
		// Portal ensures tooltips are not clipped by parent overflow/stacking contexts.
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				// Tailwind classes use existing theme tokens to keep the tooltip aligned with the app palette.
				className={cn(
					"z-50 overflow-hidden rounded-md border border-border-subtle bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
					"animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className
				)}
				{...props} />
		</TooltipPrimitive.Portal>
	)
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
