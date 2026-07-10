import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[0.6rem] border-2 p-[12px_16px]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--brand-primary)] bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] text-[var(--brand-primary-text)]",
        info:
          "border-[var(--brand-primary)] bg-[color-mix(in_oklab,var(--brand-primary)_12%,var(--card))] text-[var(--brand-primary-text)]",
        warning:
          "border-[color-mix(in_oklab,var(--ex-active)_78%,var(--foreground))] bg-[color-mix(in_oklab,var(--ex-active)_24%,var(--card))] text-[color-mix(in_oklab,var(--ex-active)_62%,var(--foreground))]",
        success:
          "border-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))] bg-[color-mix(in_oklab,var(--edu-affirm)_24%,var(--card))] text-[var(--edu-affirm-text)]",
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
