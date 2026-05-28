import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-[0.6rem] border-2 p-[12px_16px]",
	{
		variants: {
			variant: {
				default:
          "border-[var(--brand-primary)] bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] text-[var(--brand-primary)]",
				info:
          "border-[var(--brand-primary)] bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] text-[var(--brand-primary)]",
				warning:
          "border-[color-mix(in_oklab,var(--chart-5)_78%,var(--foreground))] bg-[color-mix(in_oklab,var(--chart-5)_24%,var(--card))] text-[color-mix(in_oklab,var(--chart-5)_62%,var(--foreground))]",
				success:
          "border-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))] bg-[color-mix(in_oklab,var(--chart-2)_24%,var(--card))] text-[color-mix(in_oklab,var(--chart-2)_62%,var(--foreground))]",
				danger:
          "border-[color-mix(in_oklab,var(--destructive)_72%,var(--foreground))] bg-[color-mix(in_oklab,var(--destructive)_14%,var(--card))] text-[var(--destructive)]",
			},
		},
		defaultVariants: {
			variant: "info",
		},
	}
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
	<div
		className={cn(alertVariants({ variant }), className)}
		ref={ref}
		role="alert"
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h5
		className={cn("mb-1 font-semibold leading-[var(--line-height-app)]", className)}
		ref={ref}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
	<div
		className={cn("text-sm leading-[var(--line-height-body)] [&_p]:leading-[var(--line-height-body)]", className)}
		ref={ref}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
