import { Info } from "@/components/content";
// Import the three modal-link body components from their source topic barrels
// rather than the aggregate "@/components/custom" registry. The registry builds
// AllCustomComponentsFR by spreading every grammar/pronunciation export, so a
// barrel import would pin the whole custom tree into the eager graph and defeat
// the lazy custom-component split in App.jsx. These direct paths keep only the
// two grammar topics this map needs eager; the rest of custom stays deferred.
import {
  Grammar1Body,
  Grammar2Body,
} from "@/components/custom/grammar/first-contact-grammar";
import { AboutMeSubjectPronounsBody } from "@/components/custom/grammar/about-me-grammar";

// Static, LO-specific modal-link content keyed by modal target id. Each entry is
// { title, content }, where `content` is a ready-to-render element. Lifted out of
// App.jsx (formerly built inline inside findModalLinkContent) so the render host
// stays free of learning-object data. The shapes here intentionally mirror the
// { title, contentHTML } fallback used by the config/DOM lookup in useModalLinks.
export const MODAL_CONTENT_MAP = {
  madame: {
    title: "1. Forms of address and politeness",
    content: <Grammar1Body highlightIntro />,
  },
  mademoiselle: {
    title: "1. Forms of address and politeness",
    content: <Grammar1Body highlightIntro />,
  },
  tuvous: {
    title: '2. The "tu" vs "vous" distinction',
    content: <Grammar2Body highlightIntro />,
  },
  toi: {
    title: '2. The "tu" vs "vous" distinction',
    content: <Grammar2Body highlightIntro />,
  },
  "subject-pronouns": {
    title: "3. Subject pronouns.",
    content: <AboutMeSubjectPronounsBody />,
  },
  "subject-pronouns-il": {
    title: "3. Subject pronouns.",
    content: (
      <AboutMeSubjectPronounsBody highlightTarget={`subject-pronouns-il`} />
    ),
  },
  "subject-pronouns-elle": {
    title: "3. Subject pronouns.",
    content: (
      <AboutMeSubjectPronounsBody highlightTarget={`subject-pronouns-elle`} />
    ),
  },
  "subject-pronouns-ils": {
    title: "3. Subject pronouns.",
    content: (
      <AboutMeSubjectPronounsBody highlightTarget={`subject-pronouns-ils`} />
    ),
  },
  "subject-pronouns-elles": {
    title: "3. Subject pronouns.",
    content: (
      <AboutMeSubjectPronounsBody highlightTarget={`subject-pronouns-elles`} />
    ),
  },
  "subject-pronouns-iel": {
    title: "3. Subject pronouns.",
    content: (
      <AboutMeSubjectPronounsBody highlightTarget={`subject-pronouns-iel`} />
    ),
  },
  "toilettes-note": {
    title: "Toilettes (fpl)",
    content: (
      <Info
        variant="warning"
        informationTextHTML="<p>In France the plural form is used even if there is just one facility. In other francophone countries, the singular <em>la toilette</em> occurs.</p>"
      />
    ),
  },
};
