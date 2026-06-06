import { CircleCheck, CircleX } from "lucide-react";

/**
 * Correct/incorrect result indicator shared across fill-in exercises.
 *
 * Renders a check (correct) or cross (incorrect) at one of three sizes. Colour
 * is supplied by the parent wrapper (e.g. text-[var(--edu-affirm)] /
 * text-[var(--destructive)]) so each exercise keeps control of its own layout
 * and visibility; this component owns only the icon choice + size scale.
 *
 * @param {object} props
 * @param {boolean} props.isCorrect - true → CircleCheck, false → CircleX
 * @param {"sm"|"md"|"lg"} [props.size="lg"] - sm=h-8, md=h-9, lg=h-10
 */
const RESULT_ICON_SIZES = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

export function ResultIcon({ isCorrect, size = "lg" }) {
  const Icon = isCorrect ? CircleCheck : CircleX;
  return <Icon className={RESULT_ICON_SIZES[size] || RESULT_ICON_SIZES.lg} />;
}
