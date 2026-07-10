import { HeroSection } from "../HeroSection/HeroSection";

// Fallback artwork when settings provides no introImage.
const DEFAULT_INTRO_IMAGE = {
  src: "img/lo1/first-contact.webp",
  alt: "Learners greeting illustration",
};

// Config-first intro image contract:
// - string  -> used as the src, with a generic alt
// - { src, alt?, caption? } -> used as-is (alt defaults to the generic label)
// - anything else -> LO1 default artwork
const resolveIntroImage = (introImage) => {
  if (introImage && typeof introImage === "string") {
    return {
      src: introImage,
      alt: "Learning object introduction illustration",
    };
  }
  if (introImage && typeof introImage === "object" && introImage.src) {
    return {
      src: introImage.src,
      alt: introImage.alt || "Learning object introduction illustration",
      caption: introImage.caption,
    };
  }
  return DEFAULT_INTRO_IMAGE;
};

/**
 * The "Introduction" block at the top of an open learning object. Builds the
 * HeroSection instructions layout from settings (intro / introHTML + optional
 * introImage) and renders nothing when there is neither an intro nor
 * informationHTML to show.
 */
export function IntroSection({ intro, introHTML, informationHTML, introImage }) {
  const baseLayout = introHTML
    ? { paragraphHTML: introHTML }
    : intro
      ? { paragraph: intro }
      : null;

  const introLayout = baseLayout
    ? (() => {
      const image = resolveIntroImage(introImage);
      return {
        ...baseLayout,
        image: { src: image.src, alt: image.alt, caption: image.caption },
        stackOnDesktop: true,
      };
    })()
    : null;

  if (!introLayout && !informationHTML) return null;

  return (
    <section
      aria-labelledby="introduction-heading"
      className="lo-top-section"
      id="introduction"
    >
      <HeroSection
        config={{
          id: "intro-section",
          expandable: false,
          heroSection: true,
          transparentCard: true,
          instructionsLayout: introLayout || undefined,
          informationTextHTML: informationHTML,
          stackInfo: true,
        }}
        id="LO-intro-section"
        target="introduction"
        title="Introduction"
        semanticAs="div"
      />
    </section>
  );
}
