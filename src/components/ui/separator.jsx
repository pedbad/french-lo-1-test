// src/components/ui/separator.jsx
// shadcn-style Separator wrapper built on Radix Separator.
// Uses Tailwind tokens so the divider matches the app theme.

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef(
	({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border-subtle",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className
			)}
			{...props} />
	)
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
