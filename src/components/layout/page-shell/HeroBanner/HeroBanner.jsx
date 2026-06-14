import { resolveAsset } from "@/utils/assets";

/**
 * Decorative hero banner shown above <main> when a learning object is open.
 * Entirely aria-hidden — purely visual; the page <h1> carries the accessible
 * title. Rendered only for an open LO (the caller guards on that).
 */
export function HeroBanner({ siteTitle }) {
  return (
    <div id="hero" aria-hidden="true">
      <img
        alt=""
        aria-hidden="true"
        className="hero-image"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={resolveAsset("/img/common/branding/fr-banner.svg")}
      />
      <h2 aria-hidden="true" className="hero-title text-stroke-neutral">
        {siteTitle}
      </h2>
    </div>
  );
}
