import { splitDisplayTitle } from "@/lib/loConfig";

/**
 * Page <h1> for an open learning object. A "Main — Sub" display title is split
 * into styled spans; a title with no split form renders verbatim. Rendered only
 * for an open LO (the caller guards on that) so the <h1> is never empty.
 */
export function LearningObjectTitle({ title }) {
  const parts = splitDisplayTitle(title);
  if (!parts) return <h1>{title}</h1>;

  return (
    <h1>
      <span className="title-main">{parts.main} —</span>
      <span className="title-sub">{parts.sub}</span>
    </h1>
  );
}
