import { cva } from "class-variance-authority";

/**
 * Shared variant API for exercise action buttons.
 *
 * Why:
 * - Replaces repeated class bundles across exercise components.
 * - Keeps button behavior/style rules in one place during SCSS -> Tailwind migration.
 * - Makes future visual updates a single edit instead of multi-file string edits.
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
