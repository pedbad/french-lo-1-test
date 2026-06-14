import {
  AccordionArticle,
  Explanation,
  Info,
  ModalLinkDialog,
  PhraseTable,
  Section,
} from "@/components/content";

import {
  DictationExercise,
  DraggableFillGaps,
  InlineChoiceGroup,
  InlineTypedGapExercise,
  LineMatch,
  MemoryMatchGame,
  PhraseReorderExercise,
  RadioQuiz,
  SelectExercise,
  TypedTransformExercise,
  WordOrderExercise,
  WordSpotExercise,
} from "@/components/exercises";
import {
  Footer,
  HeroBanner,
  HeroSection,
  IntroSection,
  LandingPage,
  LearningObjectTitle,
  MainMenu,
  NoConfigNotice,
} from "@/components/layout";
import { resolveAsset } from "./utils/assets";
import { handleResponse } from "./utils/network";
import { useModalLinks } from "@/hooks/useModalLinks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AllCustomComponentsFR } from "@/components/custom";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  countAccordionsInComponent,
  getLearningObjectPathParam,
  injectSharedExerciseDefaults,
  normaliseContentItems,
  normalizeInstructionSchemaNode,
  normalizeLearningObjectUrl,
  resolveLearningObjectParam,
} from "@/lib/loConfig";

// Exercises rendered uniformly as <Component config={value} />.
// Used by both render paths: renderComponent wraps each in an
// AccordionArticle; renderComponentForTab returns it bare for tabs.
// To add another such exercise, register it here — no new switch case.
const EXERCISE_REGISTRY = {
  TypedTransformExercise,
  DictationExercise,
  DraggableFillGaps,
  SelectExercise,
  InlineChoiceGroup,
  InlineTypedGapExercise,
  LineMatch,
  MemoryMatchGame,
  RadioQuiz,
  WordOrderExercise,
  PhraseReorderExercise,
  WordSpotExercise,
};

// Shared render shell for renderComponent. Every branch wraps its content in
// either an expandable AccordionArticle or a static Section/HeroSection with
// identical prop wiring; this centralises that wrapper so it lives in one place.
//
// The id/key SUFFIX is passed in per call (-Accordion / -Section /
// -Group-Accordion / -Group-Section / -Section-Section). Those ids drive
// sessionStorage accordion open/closed state AND #hash deep links — a changed
// id silently breaks persistence and links, so each call site states its exact
// suffix rather than the helper inferring it.
//
// className / semanticAs are passed through verbatim: AccordionArticle and
// Section both treat an undefined value as "use my default", so omitting them
// (plain branches) and passing undefined are equivalent. HeroSection ignores
// className entirely (its root class is hardcoded), matching prior behaviour.
const wrapInShell = ({
  value,
  expandable,
  autoExpandSingleAccordion,
  target,
  accordionId,
  sectionId,
  accordionSemanticAs,
  sectionSemanticAs,
  sectionComponent,
  className,
  title,
  titleHTML,
  children,
}) => {
  if (expandable) {
    return (
      <AccordionArticle
        expandedByDefault={autoExpandSingleAccordion}
        config={value}
        className={className}
        id={accordionId}
        key={accordionId}
        semanticAs={accordionSemanticAs}
        target={target}
        title={title}
        titleHTML={titleHTML}
      >
        {children}
      </AccordionArticle>
    );
  }
  const SectionComponent = sectionComponent || Section;
  return (
    <SectionComponent
      config={value}
      className={className}
      id={sectionId}
      key={sectionId}
      semanticAs={sectionSemanticAs}
      target={target}
      title={title}
      titleHTML={titleHTML}
    >
      {children}
    </SectionComponent>
  );
};

const setDark = (dark) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
};

const handleHashDeepLink = () => {
  if (typeof window === "undefined") return;
  const { hash } = window.location;
  if (!hash) return;
  const id = hash.slice(1);

  // Small delay to let React finish painting the newly loaded config.
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;

    // Open the accordion if it is currently closed.
    if (el.getAttribute("data-state") === "closed") {
      const trigger = el.querySelector(".accordion-trigger");
      if (trigger) trigger.click();
    }

    // Scroll after the open animation has had time to settle.
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }, 100);
};

// setState merge reducer: mirrors the partial-merge semantics of the legacy
// class component's this.setState({ ... }) calls.
const mergeState = (prev, next) => ({ ...prev, ...next });

const INITIAL_STATE = {
  dark: false,
  languageCode: "fr",
  showModalLinkDialog: false,
  modalLinkDialogTitle: "",
  modalLinkDialogContentHTML: "",
  modalLinkDialogContent: null,
  // Bumped on every config load (same OR different LO) so the exercise host can
  // remount via its key — see configGenRef / loadConfig.
  configGen: 0,
};

export default function App() {
  const [state, setState] = useReducer(mergeState, INITIAL_STATE);

  // Render-pass id generator (reset to 0 at the top of each render below).
  const autoComponentIdCounterRef = useRef(0);

  // Settings shared across all learning objects (fetched once on mount).
  const sharedSettingsRef = useRef({});

  // Guards async setState against unmount (StrictMode double-mount in dev).
  const mountedRef = useRef(false);

  // Tracks previous config so the deep-link effect fires only on falsy→truthy.
  const prevConfigRef = useRef(null);

  // Monotonic config-load counter. Incremented on every loadConfig (same OR
  // different LO) and woven into the exercise host key, so a fresh config object
  // remounts each exercise — replaces the per-component config-reset effects.
  const configGenRef = useRef(0);

  const showModalLinkDialog = useCallback((title, contentHTML, content) => {
    setState({
      showModalLinkDialog: true,
      modalLinkDialogTitle: title || "",
      modalLinkDialogContentHTML: contentHTML || "",
      modalLinkDialogContent: content || null,
    });
  }, []);

  const hideModalLinkDialog = useCallback(() => {
    setState({
      showModalLinkDialog: false,
      modalLinkDialogTitle: "",
      modalLinkDialogContentHTML: "",
      modalLinkDialogContent: null,
    });
  }, []);

  // Modal-link behavior (content resolution, a11y anchor normalization, and the
  // once-attached document click delegation) lives in this hook. Pass live config
  // so the delegated handler resolves against the current LO, not a mount snapshot.
  useModalLinks({ config: state.config, showModalLinkDialog });

  const loadConfig = (configFile, learningObjectConfigFile) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      headers: headers,
      method: "GET",
      redirect: "follow",
    };

    return new Promise((resolve, reject) => {
      fetch(resolveAsset(configFile), requestOptions)
        .then(handleResponse)
        .then((res) => {
          const { settings } = res;
          delete res["settings"];
          const normalizedConfig = injectSharedExerciseDefaults(
            normalizeInstructionSchemaNode(res),
            sharedSettingsRef.current,
          );
          const normalizedSettings = normalizeInstructionSchemaNode(settings);
          const mergedSettings = {
            ...sharedSettingsRef.current,
            ...normalizedSettings,
          };
          const {
            class: configClass,
            targetLanguageCode,
            textDirection = "ltr",
          } = mergedSettings;
          if (configClass)
            document.getElementsByTagName("html")[0].classList.add(configClass);
          document.documentElement.setAttribute("dir", textDirection);

          const currentLearningObject = learningObjectConfigFile;

          if (mountedRef.current) {
            configGenRef.current += 1;
            setState({
              config: { ...normalizedConfig },
              currentLearningObject: currentLearningObject,
              settings: { ...mergedSettings },
              targetLanguageCode,
              configGen: configGenRef.current,
            });
          }
          resolve({ targetLanguageCode });
        })
        .catch((error) => {
          console.error("Loading configuration", error);
          reject();
        });
    });
  };

  const loadIndex = (currentLearningObject) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      headers: headers,
      method: "GET",
      redirect: "follow",
    };

    return fetch(resolveAsset(`/src/index-fr.json`), requestOptions)
      .then(handleResponse)
      .then((res) => {
        const { learningObjects, title: siteTitle } = res;

        // Translate LO "id" (1-based) to array index (0-based)
        const loIndex =
          currentLearningObject >= 1 ? currentLearningObject - 1 : -1;

        let title, titleShort;
        if (loIndex >= 0 && learningObjects[loIndex]) {
          ({ title, titleShort = "" } = learningObjects[loIndex]);
          document.title = title;
        }

        if (mountedRef.current) {
          setState({
            currentLearningObject: currentLearningObject, // store ID or -1
            learningObjects: learningObjects,
            siteTitle: siteTitle,
            title: title,
            titleShort: titleShort,
          });
        }
        return { learningObjects, siteTitle };
      })
      .catch((error) => {
        console.error("Loading index", error);
        return { learningObjects: [], siteTitle: "" };
      });
  };

  const toggleDark = () => {
    let dark = false;

    if (sessionStorage.getItem(`dark`))
      dark = JSON.parse(sessionStorage.getItem(`dark`));

    if (typeof document !== "undefined") {
      document.documentElement.classList.add("no-theme-transition");
      window.setTimeout(() => {
        document.documentElement.classList.remove("no-theme-transition");
      }, 200);
    }

    setDark(!dark);
    sessionStorage.setItem("dark", !dark);
    setState({ dark: !dark });
  };

  // Mount: route normalization, scroll restoration, index + shared-settings
  // load, LO resolution + config load, dark preference, and one-time doc-level
  // modal-link delegation. Cleanup removes the delegated listeners on unmount.
  useEffect(() => {
    mountedRef.current = true;

    if (typeof window !== "undefined") {
      const { hash, pathname, search } = window.location;
      const looksLikeFilePath = /\/[^/]+\.[^/]+$/.test(pathname);
      if (!looksLikeFilePath && pathname !== "/" && !pathname.endsWith("/")) {
        // Normalize trailing slash without forcing a full page reload.
        // This avoids reload loops when server canonicalization differs.
        window.history.replaceState({}, "", `${pathname}/${search}${hash}`);
      }
    }

    // Always start at the top on hard refresh/navigation load.
    // Skip scroll-to-top when a hash is present — AccordionArticle handles
    // opening and scrolling to the target section instead.
    // We intentionally persist accordion open/closed state only, not page scroll position.
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
      }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const loParamRaw = (urlParams.get("lo") || "").trim();

    // Always load the index so the menu/landing page can render.
    // Then resolve ?lo by numeric id OR slug, while keeping backward compatibility.
    const sharedPromise = fetch("/shared-settings.json")
      .then((r) => r.json())
      .catch(() => ({}));

    Promise.all([loadIndex(-1), sharedPromise]).then(
      ([{ learningObjects = [] }, shared]) => {
        if (!mountedRef.current) return;
        sharedSettingsRef.current = shared;
        const loPathRaw = getLearningObjectPathParam(learningObjects);
        const loSelectorRaw = loPathRaw || loParamRaw;
        const resolvedLo = resolveLearningObjectParam(
          loSelectorRaw,
          learningObjects,
        );
        if (!resolvedLo) {
          setState({ currentLearningObject: -1, config: null });
          return;
        }

        const { configKey, loId, slug, title, titleShort } = resolvedLo;
        setState({
          currentLearningObject: loId,
          title,
          titleShort: titleShort || "",
        });

        normalizeLearningObjectUrl({
          currentLoPathRaw: loPathRaw,
          learningObjects,
          resolvedSlug: slug,
        });

        loadConfig(`/src/lo-config/${configKey}.json`, loId);
      },
    );

    if (sessionStorage.getItem(`dark`)) {
      const dark = JSON.parse(sessionStorage.getItem(`dark`));
      if (dark) setDark(true);
    }

    return () => {
      mountedRef.current = false;
    };
    // Mount-only effect: the data-loading closures and stable callbacks it uses
    // are intentionally captured once. Re-running would re-fetch and re-route.

  }, []);

  // When the LO config first loads, handle a hash deep link by opening the
  // matching accordion section and scrolling to it. Fire only on falsy→truthy.
  useEffect(() => {
    if (!prevConfigRef.current && state.config) {
      handleHashDeepLink();
    }
    prevConfigRef.current = state.config;
  }, [state.config]);

  const getResolvedComponentId = (id, component) => {
    if (typeof id === "string" && id.trim() !== "") {
      return id.trim();
    }

    const safeComponent =
      typeof component === "string" && component.trim() !== ""
        ? component.trim()
        : "component";
    autoComponentIdCounterRef.current += 1;
    return `auto-${safeComponent}-${autoComponentIdCounterRef.current}`;
  };

  /**
   * renderComponentForTab
   * Returns "bare" content for a component (no AccordionArticle / Section wrapper)
   * so that we can render it as a tab panel inside a Group.
   */
  const renderComponentForTab = (value) => {
    const {
      component,
      id: valueId,
      infoText,
      infoTextHTML,
      // titleText = "",
      // titleTextHTML = "",
    } = value;
    const tabInformationText = value.informationText || infoText;
    const tabInformationTextHTML = value.informationTextHTML || infoTextHTML;
    const id = getResolvedComponentId(valueId, component);

    const { languageCode, configGen } = state;

    // Registry dispatch: exercises rendered bare in a tab. Special cases
    // (Explanation, PhraseTable, custom) fall through to the switch. The
    // configGen-keyed remount replaces the old per-component config-reset effect.
    const RegisteredExercise = EXERCISE_REGISTRY[component];
    if (RegisteredExercise) {
      return <RegisteredExercise key={`${id}-${configGen}`} config={value} />;
    }

    switch (component) {
      case "Explanation":
        return (
          <>
            <Info
              informationText={tabInformationText}
              informationTextHTML={tabInformationTextHTML}
            />
            <Explanation config={value} />
          </>
        );
      case "PhraseTable":
        return <PhraseTable config={value} languageCode={languageCode} />;
      default: {
        const CustomComponent = AllCustomComponentsFR[component];
        if (CustomComponent) {
          return (
            <>
              <Info
                informationText={tabInformationText}
                informationTextHTML={tabInformationTextHTML}
              />
              <CustomComponent config={value} id={id} />
            </>
          );
        }
        return <p>Component {component} not implemented</p>;
      }
    }
  };

  const renderComponent = (
    value,
    articles,
    forcedTargetId = null,
    renderContext = {},
  ) => {
    const {
      id: valueId,
      component,
      titleText = "",
      titleTextHTML = "",
    } = value;
    const { expandable = true } = value;
    const { autoExpandSingleAccordion = false } = renderContext;

    const { currentLearningObject, languageCode, configGen } = state;
    const id = getResolvedComponentId(valueId, component);
    const targetId = forcedTargetId || id;
    const topLevelSemanticAs = forcedTargetId ? "div" : "section";
    const compoundID = `LO${currentLearningObject}-${id}`;

    // Registry dispatch for exercises that share the identical
    // accordion-wrapped template. Special cases fall through to the switch.
    const RegisteredExercise = EXERCISE_REGISTRY[component];
    if (RegisteredExercise) {
      // Registry exercises are always accordion-wrapped (force expandable).
      articles.push(
        wrapInShell({
          value,
          expandable: true,
          autoExpandSingleAccordion,
          target: targetId,
          accordionId: `${compoundID}-Accordion`,
          title: titleText,
          titleHTML: titleTextHTML,
          children: (
            <RegisteredExercise
              key={`${compoundID}-${configGen}`}
              config={value}
            />
          ),
        }),
      );
      return;
    }

    switch (component) {
      case "Explanation": {
        articles.push(
          wrapInShell({
            value,
            expandable,
            autoExpandSingleAccordion,
            target: targetId,
            accordionId: `${compoundID}-Accordion`,
            sectionId: `${compoundID}-Section`,
            sectionSemanticAs: topLevelSemanticAs,
            title: titleText,
            titleHTML: titleTextHTML,
            children: <Explanation config={value} />,
          }),
        );
        break;
      }
      case "Group": {
        const renderedGroupContent = [];
        const { content: groupContent = [] } = value;
        const { id: groupId, displayAsTabs = false } = value;

        if (!displayAsTabs) {
          // Children as sub-accordions/sections
          normaliseContentItems(groupContent).forEach((v) => {
            renderComponent(v, renderedGroupContent, null, renderContext);
          });

          articles.push(
            wrapInShell({
              value,
              expandable,
              autoExpandSingleAccordion,
              target: groupId,
              accordionId: `${compoundID}-Group-Accordion`,
              sectionId: `${compoundID}-Group-Section`,
              accordionSemanticAs: "section",
              sectionSemanticAs: topLevelSemanticAs,
              sectionComponent: value.heroSection ? HeroSection : Section,
              className: `group`,
              title: titleText,
              titleHTML: titleTextHTML,
              children: renderedGroupContent,
            }),
          );
        } else {
          // children rendered as tabs
          const tabItems = [];
          let defaultTabValue = null;

          normaliseContentItems(groupContent).forEach((v, index) => {
            const childId = v.id || `child-${index}`;
            const tabValue = childId;
            if (defaultTabValue === null) defaultTabValue = tabValue;

            const tabLabel =
              v.menuText ||
              v.titleText ||
              (typeof v.titleTextHTML === "string"
                ? v.titleTextHTML.replace(/<[^>]+>/g, "")
                : "") ||
              childId;

            const contentNode = renderComponentForTab(v);

            tabItems.push({
              content: contentNode,
              label: tabLabel,
              value: tabValue,
            });
          });

          articles.push(
            wrapInShell({
              value,
              expandable,
              autoExpandSingleAccordion,
              target: groupId,
              accordionId: `${compoundID}-Group-Accordion`,
              sectionId: `${compoundID}-Group-Section`,
              accordionSemanticAs: "section",
              sectionSemanticAs: topLevelSemanticAs,
              sectionComponent: value.heroSection ? HeroSection : Section,
              className: `group`,
              title: titleText,
              titleHTML: titleTextHTML,
              children: (
                <Tabs
                  className="w-full overflow-hidden rounded-xl border border-border/45 bg-card/80"
                  defaultValue={
                    defaultTabValue || (tabItems[0] && tabItems[0].value)
                  }
                >
                  <TabsList className="flex h-auto w-full flex-col items-stretch justify-start gap-0 overflow-visible rounded-lg border border-[color-mix(in_oklab,var(--edu-affirm)_62%,var(--foreground))] bg-muted/20 p-1 min-[1170px]:flex-wrap min-[1170px]:flex-row min-[1170px]:gap-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:border-b-2 min-[1170px]:border-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))] min-[1170px]:bg-muted/35 min-[1170px]:p-0">
                    {tabItems.map((item) => (
                      <TabsTrigger
                        className="w-full cursor-pointer justify-start rounded-md border border-transparent !px-4 !py-2 text-left !text-[length:calc(var(--font-size-sm)*1.2)] !leading-tight font-medium text-foreground/90 transition-colors duration-[800ms] ease-in-out hover:bg-[var(--accordion-mist)] hover:text-[var(--accordion-hover-text)] data-[state=active]:bg-[var(--accordion-mist)] data-[state=active]:text-[var(--accordion-hover-text)] data-[state=active]:font-bold data-[state=active]:border-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))] data-[state=active]:border-l-[5px] data-[state=active]:border-l-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))] data-[state=active]:rounded-none min-[1170px]:shrink-0 min-[1170px]:w-auto min-[1170px]:justify-center min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:border-r min-[1170px]:border-[color-mix(in_oklab,var(--edu-affirm)_62%,var(--foreground))] min-[1170px]:!min-h-[3.8rem] min-[1170px]:!px-6 min-[1170px]:!py-3 min-[1170px]:!text-[length:calc(var(--font-size-sm)*1.4)] min-[1170px]:text-center min-[1170px]:data-[state=active]:relative min-[1170px]:data-[state=active]:z-20 min-[1170px]:data-[state=active]:translate-y-[2px] min-[1170px]:data-[state=active]:bg-[var(--accordion-mist)] min-[1170px]:data-[state=active]:shadow-none min-[1170px]:data-[state=active]:rounded-t-[0.75rem] min-[1170px]:data-[state=active]:border-t-2 min-[1170px]:data-[state=active]:border-l-2 min-[1170px]:data-[state=active]:border-r-2 min-[1170px]:data-[state=active]:border-b-2 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))] min-[1170px]:data-[state=active]:!border-b-[color-mix(in_oklab,var(--muted)_25%,var(--card))]"
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {tabItems.map((item) => (
                    <TabsContent
                      className="mt-2 rounded-lg border border-[color-mix(in_oklab,var(--edu-affirm)_62%,var(--foreground))] bg-muted/20 p-4 data-[state=inactive]:hidden data-[state=active]:block min-[1170px]:mt-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:bg-muted/25 min-[1170px]:data-[state=active]:rounded-b-[0.75rem] min-[1170px]:data-[state=active]:border-x-2 min-[1170px]:data-[state=active]:border-b-2 min-[1170px]:data-[state=active]:border-t-0 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--edu-affirm)_78%,var(--foreground))]"
                      key={item.value}
                      value={item.value}
                      forceMount
                    >
                      {item.content}
                    </TabsContent>
                  ))}
                </Tabs>
              ),
            }),
          );
        }

        break;
      }
      case "PhraseTable": {
        articles.push(
          wrapInShell({
            value,
            expandable,
            autoExpandSingleAccordion,
            target: targetId,
            accordionId: `${compoundID}-Accordion`,
            sectionId: `${compoundID}-Section`,
            sectionSemanticAs: topLevelSemanticAs,
            title: titleText,
            titleHTML: titleTextHTML,
            children: (
              <PhraseTable config={value} languageCode={languageCode} />
            ),
          }),
        );
        break;
      }
      case "Section": {
        const renderedSectionContent = [];
        const { content: sectionContent = [] } = value;

        normaliseContentItems(sectionContent).forEach((v) => {
          renderComponent(v, renderedSectionContent, null, renderContext);
        });

        articles.push(
          wrapInShell({
            value,
            // Section is never accordion-wrapped; force the static branch.
            expandable: false,
            target: targetId,
            // Double suffix is intentional/legacy — preserved exactly.
            sectionId: `${compoundID}-Section-Section`,
            sectionSemanticAs: topLevelSemanticAs,
            sectionComponent: value.heroSection ? HeroSection : Section,
            title: titleText,
            titleHTML: titleTextHTML,
            children: renderedSectionContent,
          }),
        );
        break;
      }
      default: {
        const CustomComponent = AllCustomComponentsFR[component];
        if (CustomComponent) {
          articles.push(
            wrapInShell({
              value,
              expandable,
              autoExpandSingleAccordion,
              target: targetId,
              accordionId: `${compoundID}-Accordion`,
              sectionId: `${compoundID}-Section`,
              sectionSemanticAs: topLevelSemanticAs,
              title: titleText,
              titleHTML: titleTextHTML,
              children: <CustomComponent config={value} id={id} />,
            }),
          );
        } else if (component.slice(0, 4) === "HIDE") {
          // do nothing
        } else {
          articles.push(
            <p key={`notImplemented${id}`}>
              Component {component} not implemented
            </p>,
          );
        }
      }
    }
  };

  // --- Render ---
  const {
    config,
    currentLearningObject,
    languageCode,
    learningObjects = [],
    showModalLinkDialog: showModalLinkDialogOpen = false,
    modalLinkDialogTitle = "",
    modalLinkDialogContentHTML = "",
    settings,
    siteTitle,
  } = state;

  const topLevelSections = [];
  // Reset the per-render id generator before building the render tree.
  autoComponentIdCounterRef.current = 0;
  let intro, introHTML, informationHTML, introImage;
  if (settings) {
    ({ intro, introHTML, informationHTML, introImage } = settings);
  }

  if (config) {
    for (const [sectionKey, value] of Object.entries(config)) {
      const { component } = value;
      if (component) {
        const semanticSectionId = value.id || sectionKey;
        const renderedTopLevelContent = [];
        const sectionAccordionCount = countAccordionsInComponent(value);
        // UX rule: if a section has exactly one accordion, show its content by default.
        // Existing sessionStorage state still has priority in AccordionArticle.
        const autoExpandSingleAccordion = sectionAccordionCount === 1;
        renderComponent(value, renderedTopLevelContent, semanticSectionId, {
          autoExpandSingleAccordion,
        });
        const headingId = `${semanticSectionId}-heading`;
        topLevelSections.push(
          <section
            aria-labelledby={headingId}
            className="lo-top-section"
            id={semanticSectionId}
            key={`top-section-${semanticSectionId}`}
          >
            {renderedTopLevelContent}
          </section>,
        );
      }
    }
  }

  let title, titleShort;
  const loIndex = currentLearningObject >= 1 ? currentLearningObject - 1 : -1;
  if (loIndex >= 0 && learningObjects[loIndex]) {
    ({ title = "", titleShort = "" } = learningObjects[loIndex] || {});
  }

  // Once an LO config is loaded, settings.targetLanguageCode drives the root
  // language class. Before config loads it stays "" (no LO open / landing).
  const appLang = settings ? settings.targetLanguageCode || "" : "";

  return (
    <>
      {/* Provide Radix tooltips once at the app root for consistent behavior. */}
      <TooltipProvider delayDuration={300}>
        <div className={`app ${appLang}`} key={`languageDiv`}>
          <a className="skip-link" href="#content">
            Skip to main content
          </a>

          <ModalLinkDialog
            open={showModalLinkDialogOpen}
            title={modalLinkDialogTitle}
            contentHTML={modalLinkDialogContentHTML}
            content={state.modalLinkDialogContent}
            onClose={hideModalLinkDialog}
          />

          <MainMenu
            config={config}
            title={titleShort !== "" ? titleShort : title}
            toggleDark={toggleDark}
          />

          {languageCode !== undefined ? (
            <>
              {/* Big hero banner + page title: only when an LO is open.
                  On the landing (currentLearningObject === -1) the
                  LandingPage provides its own slim header + <h1>, so we
                  skip the hero (no "big hero" on landing) and avoid an
                  empty <h1>. */}
              {currentLearningObject !== -1 ? (
                <HeroBanner siteTitle={siteTitle} />
              ) : null}
              <main id="content" key="content" tabIndex="-1">
                {currentLearningObject !== -1 ? (
                  <LearningObjectTitle title={title} />
                ) : null}
                <IntroSection
                  intro={intro}
                  introHTML={introHTML}
                  informationHTML={informationHTML}
                  introImage={introImage}
                />

                {currentLearningObject !== -1 ? topLevelSections : null}
                {learningObjects.length > 0 && currentLearningObject === -1 ? (
                  <LandingPage learningObjects={learningObjects} />
                ) : null}
              </main>
            </>
          ) : (
            <NoConfigNotice />
          )}
          <Footer />
        </div>
      </TooltipProvider>
    </>
  );
}
