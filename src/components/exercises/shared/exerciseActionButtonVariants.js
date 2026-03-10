import { cva } from "class-variance-authority";

/**
 * Shared variant API for exercise action buttons.
 *
 * Why this is better for maintenance (especially for SCSS-first teams):
 * - Legacy pattern: each exercise component hand-built long class strings.
 *   Example: "btn-ped-warn hidden-help exercise-icon-button show".
 * - Problem: one visual/state change required multi-file edits and could drift.
 * - This file defines a single variant contract (tone/progressive/visible/align/role).
 * - Components now declare intent (what state they need) instead of repeating raw class
 *   implementation details.
 *
 * Best-practice alignment:
 * - Matches the same cva-based pattern already used by shadcn/ui component styling.
 * - Reduces regression risk by centralizing style composition logic.
 * - Improves onboarding: developers read one API instead of reverse-engineering many class strings.
 */
export const exerciseActionButtonVariants = cva("exercise-icon-button", {
	variants: {
		tone: {
			// Keep "none" as default to avoid unintentional color changes in legacy callsites.
			none: "",
			neutral: "btn-chart-2",
			primary: "btn-hero-title",
			warn: "btn-ped-warn",
		},
		progressive: {
			false: "",
			true: "hidden-help",
		},
		visible: {
			false: "",
			true: "show",
		},
		align: {
			default: "",
			right: "btn-check-right",
		},
		role: {
			default: "",
			reset: "wordparts-reset",
			reveal: "wordparts-reveal",
		},
	},
	defaultVariants: {
		align: "default",
		progressive: false,
		role: "default",
		tone: "none",
		visible: false,
	},
});
