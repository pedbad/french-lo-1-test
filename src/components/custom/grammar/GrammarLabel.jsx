/**
 * GrammarLabel
 *
 * Single source of truth for the short introductory label that appears
 * immediately before a grammar table or example list, e.g.:
 *
 *   <GrammarLabel>For example:</GrammarLabel>
 *   <GrammarLabel className="mt-4">Here is the full list of pronouns:</GrammarLabel>
 *
 * Rules:
 * - Always renders as a plain <div> (not a heading element) so WAVE does not
 *   flag it as a "possible heading".
 * - Always inherits the correct body font size via the --font-size-base token,
 *   preventing the size drift that occurs when <div> replaces <p> inside
 *   .panel wrappers.
 * - Accepts an optional className for spacing variants (e.g. "mt-3", "mt-4")
 *   while keeping the base size consistent.
 *
 * Do NOT replace this with a plain <div>, <p>, or <h4>. All grammar files
 * must import and use this component for these labels.
 */
export const GrammarLabel = ({ children, className }) => (
	<div style={{ fontSize: "var(--font-size-base)" }} className={className || undefined}>
		{children}
	</div>
);
