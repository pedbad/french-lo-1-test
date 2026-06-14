import { ModalLinkDialog } from "@/components/content";

import {
  Footer,
  HeroBanner,
  IntroSection,
  LandingPage,
  LearningObjectTitle,
  MainMenu,
  NoConfigNotice,
} from "@/components/layout";
import { resolveAsset } from "./utils/assets";
import { handleResponse } from "./utils/network";
import { useModalLinks } from "@/hooks/useModalLinks";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRenderer } from "./render/renderLearningObject";

import {
  countAccordionsInComponent,
  getLearningObjectPathParam,
  injectSharedExerciseDefaults,
  normalizeInstructionSchemaNode,
  normalizeLearningObjectUrl,
  resolveLearningObjectParam,
} from "@/lib/loConfig";

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
    const sharedPromise = fetch(resolveAsset("/shared-settings.json"))
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


  // --- Render ---
  const {
    config,
    configGen,
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
  // One renderer per render pass; it owns the per-pass auto-id counter and the
  // LO-scoped values the dispatch needs (see src/render/renderLearningObject).
  const renderer = createRenderer({
    currentLearningObject,
    languageCode,
    configGen,
  });
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
        renderer.renderComponent(
          value,
          renderedTopLevelContent,
          semanticSectionId,
          { autoExpandSingleAccordion },
        );
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
