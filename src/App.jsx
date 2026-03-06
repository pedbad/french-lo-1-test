import {
  AccordionArticle,
  AnswerTable,
  AudioClip,
  Congratulate,
  DictationExercise,
  DraggableFillGaps,
  DropDowns,
  ErrorLog,
  Explanation,
  Figure,
  Footer,
  Header,
  HeroSection,
  Info,
  InlineChoiceGroup,
  LandingPage,
  MainMenu,
  MemoryMatchGame,
  ModalLinkDialog,
  Monologue,
  PhraseTable,
  RadioQuiz,
  ReadAloud,
  Section,
  SelectExercise,
  SequenceOrder,
  Sortable,
  TypedTransformExercise,
  WordGrid,
  WordParts,
} from "./components";
import { resolveAsset } from "./utils/assets";
import { handleResponse } from "./utils/network";
import { handleModalLinkClick } from "./utils/dom";
import { playAudioLink } from "./utils/audioPlayback";
import { isTouchChrome } from "./utils/device";
import { speak } from "./utils/speech";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AllCustomComponentsFR,
  Grammar1Body,
  Grammar2Body,
  AboutMeSubjectPronounsBody,
} from "@/components/custom";
import DOMPurify from "dompurify";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const splitDisplayTitle = (value) => {
  if (typeof value !== "string") return null;

  const title = value.trim();
  if (!title) return null;

  // Keep split rules explicit and conservative so hyphenated words
  // (for example "café-crème") are not treated as title separators.
  const splitPatterns = [
    /:\s+/, // "Main: sub"
    /\s+—\s+/, // "Main — sub"
    /\s+–\s+/, // "Main – sub"
    /\s+\|\s+/, // "Main | sub"
    /\s+-\s+/, // "Main - sub"
  ];

  for (const pattern of splitPatterns) {
    const match = title.match(pattern);
    if (!match || match.index === undefined) continue;

    const { index } = match;
    const [separator] = match;
    const main = title.slice(0, index).trim();
    const sub = title.slice(index + separator.length).trim();
    if (!main || !sub) continue;

    return { main, sub };
  }

  return null;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dark: false,
      dialogContent: "",
      errors: [],
      languageCode: "fr",
      showDialog: false,
      showModalLinkDialog: false,
      modalLinkDialogTitle: "",
      modalLinkDialogContentHTML: "",
      modalLinkDialogContent: null,
    };

    // this.loadConfig = this.loadConfig.bind(this);
    // this.loadIndex = this.loadIndex.bind(this);
    // this.hideDialog = this.hideDialog.bind(this);
    // this.hideSpeechError = this.hideSpeechError.bind(this);
    // this.initialiseSpeeches = this.initialiseSpeeches.bind(this);
    // this.initialiseSynth = this.initialiseSynth.bind(this);
    // this.renderComponent = this.renderComponent.bind(this);
    // this.selectLearningObject = this.selectLearningObject.bind(this);
    // this.toggleDark = this.toggleDark.bind(this);

    this.autoComponentIdCounter = 0;
    this.modalLinkDelegationSetup = false;
    this.handleDelegatedModalLinkClick = null;
    this.handleDelegatedModalTargetClick = null;
  }

  clearError = (index) => {
    const { errors } = this.state;
    errors.splice(index, 1);
    this.setState({
      errors: errors,
    });
  };

  clearLog = () => {
    this.setState({
      errors: [],
    });
  };

  componentDidMount = () => {
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
    // We intentionally persist accordion open/closed state only, not page scroll position.
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const loParamRaw = (urlParams.get("lo") || "").trim();

    // Always load the index so the menu/landing page can render.
    // Then resolve ?lo by numeric id OR slug, while keeping backward compatibility.
    this.loadIndex(-1).then(({ learningObjects = [] }) => {
      const loPathRaw = this.getLearningObjectPathParam(learningObjects);
      const loSelectorRaw = loPathRaw || loParamRaw;
      const resolvedLo = this.resolveLearningObjectParam(
        loSelectorRaw,
        learningObjects,
      );
      if (!resolvedLo) {
        this.setState({ currentLearningObject: -1, config: null });
        return;
      }

      const { configKey, loId, slug, title, titleShort } = resolvedLo;
      this.setState({
        currentLearningObject: loId,
        title,
        titleShort: titleShort || "",
      });

      this.normalizeLearningObjectUrl({
        currentLoPathRaw: loPathRaw,
        learningObjects,
        resolvedSlug: slug,
      });

      const configPromise = this.loadConfig(
        `/src/lo-config/${configKey}.json`,
        loId,
      );
      this.initialiseModalLinks();
      configPromise.then(this.initialiseSynth);
    });

    if (sessionStorage.getItem(`dark`)) {
      const dark = JSON.parse(sessionStorage.getItem(`dark`));
      if (dark) this.setDark(true);
    }
  };

  componentDidUpdate = () => {
    this.initialiseModalLinks();
  };

  componentWillUnmount = () => {
    if (this.modalLinkDelegationSetup) {
      document.removeEventListener(
        "click",
        this.handleDelegatedModalLinkClick,
        true,
      );
      document.removeEventListener(
        "click",
        this.handleDelegatedModalTargetClick,
        true,
      );
      this.modalLinkDelegationSetup = false;
    }
  };

  hideDialog = () => {
    this.setState({
      dialogContent: "",
      showDialog: false,
    });
  };

  hideSpeechError = () => {
    this.setState({
      dialogContent: "",
      showSpeechError: false,
    });
  };

  showModalLinkDialog = (title, contentHTML, content) => {
    this.setState({
      showModalLinkDialog: true,
      modalLinkDialogTitle: title || "",
      modalLinkDialogContentHTML: contentHTML || "",
      modalLinkDialogContent: content || null,
    });
  };

  hideModalLinkDialog = () => {
    this.setState({
      showModalLinkDialog: false,
      modalLinkDialogTitle: "",
      modalLinkDialogContentHTML: "",
      modalLinkDialogContent: null,
    });
  };

  findModalLinkContent = (targetId) => {
    const { config } = this.state;
    const modalContentMap = {
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
    };

    if (modalContentMap[targetId]) return modalContentMap[targetId];
    if (!config) {
      return {
        title: "Not found",
        contentHTML: "<p>Content not loaded.</p>",
      };
    }

    const entries = new Map();

    const addEntry = (item) => {
      if (!item || typeof item !== "object") return;
      const { id } = item;
      const contentHTML =
        item.infoTextHTML ||
        item.informationTextHTML ||
        item.informationText ||
        "";
      if (!id || !contentHTML) return;
      const rawTitle = item.titleText || item.titleTextHTML || "Explanation";
      const title = rawTitle.replace(/<[^>]*>/g, "");
      entries.set(id, { title, contentHTML });
    };

    Object.values(config).forEach((section) => {
      if (!section || typeof section !== "object") return;
      addEntry(section);
      if (Array.isArray(section.content)) {
        section.content.forEach((contentItem) => {
          const componentConfig = contentItem
            ? Object.values(contentItem)[0]
            : null;
          addEntry(componentConfig);
        });
      }
    });

    if (entries.has(targetId)) return entries.get(targetId);

    const targetEl =
      document.getElementById(targetId) ||
      document.querySelector(
        `.modal-link-target[data-modal-target="${targetId}"]`,
      );
    if (targetEl) {
      const container =
        targetEl.closest("p, li, article, section, div") || targetEl;
      return {
        title: targetId,
        contentHTML: container.outerHTML,
      };
    }

    return {
      title: "Not found",
      contentHTML: `<p>Explanation for "${targetId}" not found.</p>`,
    };
  };

  initialiseModalLinks = () => {
    // Normalize hash modal links so accessibility tooling does not flag them
    // as broken same-page anchors. We keep the semantic target in
    // `data-modal-target` and use `#content` as safe fallback href.
    document.querySelectorAll("a.modal-link").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const explicitTarget = (
        anchor.getAttribute("data-modal-target") || ""
      ).trim();
      const hashTarget = href.includes("#")
        ? (href.split("#").pop() || "").replace(/^[.#]+/, "").trim()
        : "";
      const targetId = explicitTarget || hashTarget;
      if (!targetId) return;
      anchor.setAttribute("data-modal-target", targetId);
      if (href.startsWith("#")) {
        anchor.setAttribute("href", "#content");
      }
    });

    // `modal-link` is reserved for content links that open the modal dialog.
    // Main navigation uses `nav-scroll-link` and handles scroll behavior in MainMenu.
    // Use delegated listeners so links created by child re-renders are always wired.
    if (this.modalLinkDelegationSetup) return;

    this.handleDelegatedModalLinkClick = (e) => {
      const targetElement =
        e.target instanceof Element
          ? e.target
          : e.target && e.target.parentElement instanceof Element
            ? e.target.parentElement
            : null;
      const anchor = targetElement
        ? targetElement.closest("a.modal-link")
        : null;
      if (!anchor) return;

      handleModalLinkClick(e, {
        mode: "modal",
        findModalLinkContent: this.findModalLinkContent,
        linkEl: anchor,
        showModalLinkDialog: this.showModalLinkDialog,
      });
    };

    this.handleDelegatedModalTargetClick = (e) => {
      const targetElement =
        e.target instanceof Element
          ? e.target
          : e.target && e.target.parentElement instanceof Element
            ? e.target.parentElement
            : null;
      const targetAnchor = targetElement
        ? targetElement.closest("a.modal-link-target")
        : null;
      if (!targetAnchor) return;
      e.preventDefault();
    };

    // Use capture phase so modal links still work when nested components stop
    // propagation during bubble phase (for example Section content wrappers).
    document.addEventListener(
      "click",
      this.handleDelegatedModalLinkClick,
      true,
    );
    document.addEventListener(
      "click",
      this.handleDelegatedModalTargetClick,
      true,
    );
    this.modalLinkDelegationSetup = true;
  };

  initialiseSpeeches = (synth, targetLanguageCode, voices) => {
    const speeches = document.querySelectorAll(".speak");
    speeches.forEach((speech) => {
      if (targetLanguageCode && synth && voices && voices.length >= 1) {
        console.error("There's a '.speak' that I missed"); // eslint-disable-line
        if (speech.setup !== true && speech.getAttribute("setup") !== true) {
          speech.setAttribute("aria-label", "Non-selectable text");
          speech.setAttribute("setup", "true");
          speech.addEventListener("click", (e) =>
            speak(e, synth, targetLanguageCode, voices),
          );
          speech.setup = true;
        }
      }
    });

    const audioLinks = document.querySelectorAll(".audio-link");
    audioLinks.forEach((audioLink) => {
      if (
        audioLink.setup !== true &&
        audioLink.getAttribute("setup") !== true
      ) {
        const soundFile = audioLink.getAttribute("sound-file");
        if (soundFile !== null) {
          audioLink.setAttribute("setup", "true");
          audioLink.addEventListener("click", () => playAudioLink(soundFile));
          audioLink.setup = true;
        }
      }
    });
  };

  initialiseSynth = () => {
    const { targetLanguageCode } = this.state;
    const synth = window.speechSynthesis;

    const mediaContent = window
      .getComputedStyle(document.body, "::before")
      .getPropertyValue("content");

    const isFirefox = /firefox/i.test(navigator.userAgent);

    const sortVoices = (voices) =>
      voices.sort((a, b) =>
        a.lang.localeCompare(b.lang, undefined, { sensitivity: "base" }),
      );

    const filterVoicesByLang = (voices, lang) =>
      voices.filter((voice) => voice.lang === lang);

    const enableSpeech = (voices) => {
      const filteredVoices = filterVoicesByLang(
        sortVoices(voices),
        targetLanguageCode,
      );
      this.initialiseSpeeches(synth, targetLanguageCode, filteredVoices);
      document.documentElement.classList.add("can-speak");
      this.setState({ showSpeechError: false });
    };

    if (isFirefox) {
      setTimeout(() => {
        const voices = synth.getVoices();
        enableSpeech(voices);
      }, 1000);
    }

    synth.onvoiceschanged = () => {
      if (
        (mediaContent[1] === "S" || mediaContent[1] === "M") &&
        isTouchChrome()
      ) {
        // Chrome touch workaround, do nothing
      } else {
        const voices = synth.getVoices();
        enableSpeech(voices);
      }
    };
  };

  loadConfig = (configFile, learningObjectConfigFile) => {
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
          const normalizedConfig = this.normalizeInstructionSchemaNode(res);
          const normalizedSettings =
            this.normalizeInstructionSchemaNode(settings);
          const { class: configClass, targetLanguageCode } = normalizedSettings;
          if (configClass)
            document.getElementsByTagName("html")[0].classList.add(configClass);

          const currentLearningObject = learningObjectConfigFile;

          this.setState(
            {
              config: { ...normalizedConfig },
              currentLearningObject: currentLearningObject,
              settings: { ...normalizedSettings },
              targetLanguageCode,
            },
            () => resolve({ targetLanguageCode }),
          );
        })
        .catch((error) => {
          const action = `Loading configuration`;
          this.logError(action, error);
          reject();
        });
    });
  };

  hasNonEmptyInstructionValue = (value) =>
    typeof value === "string" && value.trim() !== "";

  normalizeSlug = (value = "") =>
    `${value}`
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-");

  resolveLearningObjectParam = (loParamRaw, learningObjects = []) => {
    if (!loParamRaw) return null;

    const numericLoId = parseInt(loParamRaw, 10);
    if (Number.isInteger(numericLoId) && numericLoId >= 1) {
      const entry = learningObjects[numericLoId - 1];
      if (!entry) return null;
      const entrySlug = entry.slug ? this.normalizeSlug(entry.slug) : "";
      if (!entrySlug) return null;
      return {
        configKey: entrySlug,
        loId: numericLoId,
        slug: entry.slug || entrySlug,
        title: entry.title,
        titleShort: entry.titleShort || "",
      };
    }

    const normalizedTarget = this.normalizeSlug(loParamRaw);
    const index = learningObjects.findIndex((entry) => {
      const entrySlug = entry?.slug ? this.normalizeSlug(entry.slug) : "";
      return entrySlug !== "" && entrySlug === normalizedTarget;
    });
    if (index < 0) return null;

    const entry = learningObjects[index];
    const entrySlug = entry.slug ? this.normalizeSlug(entry.slug) : normalizedTarget;
    return {
      configKey: entrySlug,
      loId: index + 1,
      slug: entry.slug || normalizedTarget,
      title: entry.title,
      titleShort: entry.titleShort || "",
    };
  };

  getLearningObjectPathParam = (learningObjects = []) => {
    if (typeof window === "undefined") return "";
    const pathSegments = window.location.pathname
      .split("/")
      .filter(Boolean);
    if (!pathSegments.length) return "";

    const lastSegment = decodeURIComponent(pathSegments[pathSegments.length - 1]);
    const target = this.normalizeSlug(lastSegment);
    const slugSet = new Set(
      (learningObjects || [])
        .map((entry) => this.normalizeSlug(entry?.slug || ""))
        .filter(Boolean),
    );
    return slugSet.has(target) ? lastSegment : "";
  };

  normalizeLearningObjectUrl = ({
    currentLoPathRaw = "",
    learningObjects = [],
    resolvedSlug = "",
  }) => {
    if (typeof window === "undefined" || !resolvedSlug) return;

    const targetSlug = this.normalizeSlug(resolvedSlug);
    if (!targetSlug) return;

    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slugSet = new Set(
      (learningObjects || [])
        .map((entry) => this.normalizeSlug(entry?.slug || ""))
        .filter(Boolean),
    );

    if (currentLoPathRaw && pathSegments.length > 0) {
      pathSegments[pathSegments.length - 1] = resolvedSlug;
    } else {
      pathSegments.push(resolvedSlug);
    }

    if (url.searchParams.has("lo")) {
      url.searchParams.delete("lo");
    }

    // If current path already contains an LO slug, ensure we keep only the
    // resolved slug segment instead of accumulating nested /slug/slug/ paths.
    if (!currentLoPathRaw && pathSegments.length > 1) {
      const penultimateIndex = pathSegments.length - 2;
      const penultimateIsSlug = slugSet.has(
        this.normalizeSlug(pathSegments[penultimateIndex]),
      );
      if (penultimateIsSlug) {
        pathSegments.splice(penultimateIndex, 1);
      }
    }

    const targetPathname = `/${pathSegments.join("/")}/`;
    const targetSearch = url.search;
    const targetHash = url.hash;

    if (
      targetPathname === window.location.pathname &&
      targetSearch === window.location.search &&
      targetHash === window.location.hash
    ) {
      return;
    }

    window.history.replaceState(
      {},
      "",
      `${targetPathname}${targetSearch}${targetHash}`,
    );
  };

  normalizeInstructionSchemaNode = (node) => {
    if (Array.isArray(node)) {
      return node.map((item) => this.normalizeInstructionSchemaNode(item));
    }

    if (!node || typeof node !== "object") return node;

    const normalized = { ...node };

    // Legacy alias compatibility: prefer canonical informationText* keys.
    if (
      !this.hasNonEmptyInstructionValue(normalized.informationTextHTML) &&
      this.hasNonEmptyInstructionValue(normalized.infoTextHTML)
    ) {
      normalized.informationTextHTML = normalized.infoTextHTML;
    }
    if (
      !this.hasNonEmptyInstructionValue(normalized.informationText) &&
      this.hasNonEmptyInstructionValue(normalized.infoText)
    ) {
      normalized.informationText = normalized.infoText;
    }

    // PhraseTable guidance should render through the Info alert contract.
    // During migration, lift legacy instructionsText* into informationText*
    // and suppress duplicate instructions rendering for this component.
    if (
      normalized.component === "PhraseTable" &&
      !this.hasNonEmptyInstructionValue(normalized.informationTextHTML) &&
      !this.hasNonEmptyInstructionValue(normalized.informationText)
    ) {
      if (this.hasNonEmptyInstructionValue(normalized.instructionsTextHTML)) {
        normalized.informationTextHTML = normalized.instructionsTextHTML;
        delete normalized.instructionsTextHTML;
      } else if (
        this.hasNonEmptyInstructionValue(normalized.instructionsText)
      ) {
        normalized.informationText = normalized.instructionsText;
        delete normalized.instructionsText;
      }
    }

    Object.keys(normalized).forEach((key) => {
      const value = normalized[key];
      if (value && typeof value === "object") {
        normalized[key] = this.normalizeInstructionSchemaNode(value);
      }
    });

    return normalized;
  };

  loadIndex = (currentLearningObject) => {
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

        this.setState({
          currentLearningObject: currentLearningObject, // store ID or -1
          learningObjects: learningObjects,
          siteTitle: siteTitle,
          title: title,
          titleShort: titleShort,
        });
        return { learningObjects, siteTitle };
      })
      .catch((error) => {
        const action = `Loading index`;
        this.logError(action, error);
        return { learningObjects: [], siteTitle: "" };
      });
  };

  logError = (action, ...params) => {
    const { errors, refreshErrorLog } = this.state;
    if (params.length === 1) {
      const [error] = params;
      const {
        detail,
        error_code: errorCode,
        error_message: errorMessage,
        message,
        status,
        statusText = "",
      } = error;
      let Message = "";
      let Status = "";
      if (errorCode && errorMessage) {
        Message += errorMessage;
        Status += errorCode;
      }
      if (status) Status = status;
      if (message) Message += message;
      if (detail) Message += detail;

      errors.push({
        action: action,
        message: Message,
        statusCode: Status,
        statusText: statusText,
      });
    } else {
      const [statusCode = "", statusText = "", message = ""] = params;

      errors.push({
        action: action,
        message: message,
        statusCode: statusCode,
        statusText: statusText,
      });
    }

    this.setState({
      errors: errors,
      refreshErrorLog: !refreshErrorLog,
      showSpinner: false,
    });
  };

  setDark = (dark) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
  };

  toggleDark = () => {
    let dark = false;

    if (sessionStorage.getItem(`dark`))
      dark = JSON.parse(sessionStorage.getItem(`dark`));

    if (typeof document !== "undefined") {
      document.documentElement.classList.add("no-theme-transition");
      window.setTimeout(() => {
        document.documentElement.classList.remove("no-theme-transition");
      }, 200);
    }

    this.setDark(!dark);
    // const html = document.getElementsByName('html');
    // const cl = html.classList;

    // console.log("html", html, cl);
    this.setState({ dark: !dark }, sessionStorage.setItem("dark", !dark));
  };

  normaliseContentItems = (content = []) => {
    // Supports BOTH:
    // 1) New format: [{ id, component, ... }, ...]
    // 2) Old format: [{ someKey: { id, component, ... } }, ...]
    // Also tolerates accidental nulls.
    return (content || [])
      .map((item) => {
        if (!item) return null;

        // New format: looks like a config object already
        if (item.component) return item;

        // Old format wrapper: { "item1": { component:"SomeComponent", ... } }
        const keys = Object.keys(item);
        const values = Object.values(item);
        if (keys.length === 1 && values.length === 1 && values[0]?.component) {
          const cfg = values[0];
          if (!cfg.id) cfg.id = keys[0];
          return cfg;
        }

        return null;
      })
      .filter(Boolean);
  };

  getResolvedComponentId = (id, component) => {
    if (typeof id === "string" && id.trim() !== "") {
      return id.trim();
    }

    const safeComponent =
      typeof component === "string" && component.trim() !== ""
        ? component.trim()
        : "component";
    this.autoComponentIdCounter += 1;
    return `auto-${safeComponent}-${this.autoComponentIdCounter}`;
  };

  countAccordionsInComponent = (value) => {
    if (!value || typeof value !== "object") return 0;

    const { component, expandable = true } = value;
    if (typeof component !== "string" || component.trim() === "") return 0;
    if (component.startsWith("HIDE")) return 0;

    // Count expandable nodes exactly as the renderer creates accordion wrappers.
    // We use this to auto-open section content only when there is a single
    // accordion in the whole top-level section.
    switch (component) {
      case "Group": {
        const { content: groupContent = [], displayAsTabs = false } = value;
        const groupItems = this.normaliseContentItems(groupContent);
        if (displayAsTabs) {
          // Tab children render as bare content; only group wrapper can be accordion.
          return expandable ? 1 : 0;
        }
        const childCount = groupItems.reduce(
          (sum, item) => sum + this.countAccordionsInComponent(item),
          0,
        );
        return (expandable ? 1 : 0) + childCount;
      }
      case "Section": {
        const { content: sectionContent = [] } = value;
        const sectionItems = this.normaliseContentItems(sectionContent);
        return sectionItems.reduce(
          (sum, item) => sum + this.countAccordionsInComponent(item),
          0,
        );
      }
      case "Explanation":
      case "PhraseTable":
        return expandable ? 1 : 0;
      default:
        return expandable ? 1 : 0;
    }
  };

  /**
   * renderComponentForTab
   * Returns "bare" content for a component (no AccordionArticle / Section wrapper)
   * so that we can render it as a tab panel inside a Group.
   */
  renderComponentForTab = (value) => {
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
    const id = this.getResolvedComponentId(valueId, component);

    const { languageCode } = this.state;

    switch (component) {
      case "AnswerTable":
        return (
          <AnswerTable
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "TypedTransformExercise":
        return (
          <TypedTransformExercise
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "DictationExercise":
        return (
          <DictationExercise
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "Blanks":
      case "DraggableFillGaps":
        return (
          <DraggableFillGaps
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "DropDowns":
        return (
          <DropDowns
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "SelectExercise":
        return (
          <SelectExercise
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "InlineChoiceGroup":
        return (
          <InlineChoiceGroup
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "Explanation":
        return (
          <>
            <Info
              informationText={tabInformationText}
              informationTextHTML={tabInformationTextHTML}
            />
            <Explanation
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </>
        );
      case "MemoryMatchGame":
        return (
          <MemoryMatchGame
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "Monologue":
        return (
          <Monologue
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "PhraseTable":
        return (
          <PhraseTable
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
            languageCode={languageCode}
          />
        );
      case "RadioQuiz":
        return (
          <RadioQuiz
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "ReadAloud":
        return (
          <ReadAloud
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "SequenceOrder":
        return (
          <SequenceOrder
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "Sortable":
        return (
          <Sortable
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "WordGrid":
        return (
          <WordGrid
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      case "WordParts":
        return (
          <WordParts
            config={value}
            logError={this.logError}
            showDialog={this.showDialog}
          />
        );
      default: {
        let CustomComponent;
        switch (languageCode) {
          case "fr":
            CustomComponent = AllCustomComponentsFR[component];
            break;
          default:
            CustomComponent = AllCustomComponentsFR[component];
            break;
        }
        if (CustomComponent) {
          return (
            <>
              <Info
                informationText={tabInformationText}
                informationTextHTML={tabInformationTextHTML}
              />
              <CustomComponent id={id} showDialog={this.showDialog} />
            </>
          );
        }
        return <p>Component {component} not implemented</p>;
      }
    }
  };

  render = () => {
    const {
      config,
      currentLearningObject,
      dialogContent,
      errors,
      languageCode,
      learningObjects = [],
      refreshErrorLog,
      showDialog = false,
      showModalLinkDialog = false,
      modalLinkDialogTitle = "",
      modalLinkDialogContentHTML = "",
      settings,
      showSpeechError = false,
      siteTitle,
    } = this.state;
    const topLevelSections = [];
    this.autoComponentIdCounter = 0;
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
          const sectionAccordionCount = this.countAccordionsInComponent(value);
          // UX rule: if a section has exactly one accordion, show its content by default.
          // Existing sessionStorage state still has priority in AccordionArticle.
          const autoExpandSingleAccordion = sectionAccordionCount === 1;
          this.renderComponent(
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

    let targetLanguageCode = "";
    if (settings) {
      ({ targetLanguageCode } = settings);
      this.targetLanguageCode = targetLanguageCode;
    }

    return (
      <>
        {/* Provide Radix tooltips once at the app root for consistent behavior. */}
        <TooltipProvider delayDuration={300}>
          <div
            className={`app ${this.targetLanguageCode ? this.targetLanguageCode : ""}`}
            key={`languageDiv`}
          >
            <a className="skip-link" href="#content">
              Skip to main content
            </a>

            <ErrorLog
              dialog={this.dialog}
              errors={errors}
              clearLog={this.clearLog}
              clearError={this.clearError}
              refreshErrorLog={refreshErrorLog}
            />
            <ModalLinkDialog
              open={showModalLinkDialog}
              title={modalLinkDialogTitle}
              contentHTML={modalLinkDialogContentHTML}
              content={this.state.modalLinkDialogContent}
              onClose={this.hideModalLinkDialog}
            />

            <MainMenu
              config={config}
              title={titleShort !== "" ? titleShort : title}
              toggleDark={this.toggleDark}
            />

            <Congratulate
              className={`${showDialog ? "show" : ""}`}
              enabled={settings ? settings.showCongratulations : null}
              hideDialog={this.hideDialog}
              id="congratulate-success"
              content={dialogContent}
            />
            <Congratulate
              className={`${showSpeechError ? "show" : ""}`}
              enabled={true}
              hideDialog={this.hideSpeechError}
              id="SpeechSynthesisError"
              content={`This browser cannot perform speech synthesis. Please use a larger device and a browser such as Chrome`}
            />

            {languageCode !== undefined ? (
              <>
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
                  <h2
                    aria-hidden="true"
                    className="hero-title text-stroke-chart-3"
                  >
                    {siteTitle}
                  </h2>
                </div>
                <main id="content" key="content" tabIndex="-1">
                  <h1>
                    {(() => {
                      const parts = splitDisplayTitle(title);
                      if (!parts) return title;

                      return (
                        <>
                          <span className="title-main">{parts.main} —</span>
                          <span className="title-sub">{parts.sub}</span>
                        </>
                      );
                    })()}
                  </h1>
                  {(() => {
                    const introLayout = introHTML
                      ? { paragraphHTML: introHTML }
                      : intro
                        ? { paragraph: intro }
                        : null;
                    if (introLayout) {
                      const resolvedIntroImage = (() => {
                        // Config-first intro image contract:
                        // - use settings.introImage when provided (string or {src, alt, caption})
                        // - otherwise fall back to LO1 default artwork
                        if (introImage && typeof introImage === "string") {
                          return {
                            src: introImage,
                            alt: "Learning object introduction illustration",
                          };
                        }
                        if (
                          introImage &&
                          typeof introImage === "object" &&
                          introImage.src
                        ) {
                          return {
                            src: introImage.src,
                            alt:
                              introImage.alt ||
                              "Learning object introduction illustration",
                            caption: introImage.caption,
                          };
                        }
                        return {
                          src: "img/lo1/first-contact.svg",
                          alt: "Learners greeting illustration",
                        };
                      })();
                      introLayout.image = {
                        src: resolvedIntroImage.src,
                        alt: resolvedIntroImage.alt,
                        caption: resolvedIntroImage.caption,
                      };
                      introLayout.stackOnDesktop = true;
                    }
                    return introLayout || informationHTML ? (
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
                    ) : null;
                  })()}

                  {currentLearningObject !== -1 ? topLevelSections : null}
                  {learningObjects.length > 0 &&
                  currentLearningObject === -1 ? (
                    <LandingPage learningObjects={learningObjects} />
                  ) : null}
                </main>
              </>
            ) : (
              <div className={`no-config`}>
                <h1>No learning object selected</h1>
                <h2>{`${window.location.host}${window.location.pathname}first-contact/`}</h2>
                <p>
                  Open a learning object by slug path. If absent, the landing
                  page is shown.
                </p>
              </div>
            )}
            <Footer />
          </div>
        </TooltipProvider>
      </>
    );
  };

  renderComponent = (
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

    const { currentLearningObject, languageCode } = this.state;
    const id = this.getResolvedComponentId(valueId, component);
    const targetId = forcedTargetId || id;
    const topLevelSemanticAs = forcedTargetId ? "div" : "section";
    const compoundID = `LO${currentLearningObject}-${id}`;

    switch (component) {
      case "AnswerTable": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <AnswerTable
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "TypedTransformExercise": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <TypedTransformExercise
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "DictationExercise": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <DictationExercise
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "Blanks":
      case "DraggableFillGaps": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <DraggableFillGaps
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "DropDowns": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <DropDowns
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "SelectExercise": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <SelectExercise
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "InlineChoiceGroup": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <InlineChoiceGroup
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "Explanation": {
        if (expandable) {
          articles.push(
            <AccordionArticle
              expandedByDefault={autoExpandSingleAccordion}
              config={value}
              id={`${compoundID}-Accordion`}
              key={`${compoundID}-Accordion`}
              target={targetId}
              title={titleText}
              titleHTML={titleTextHTML}
            >
              <Explanation
                config={value}
                logError={this.logError}
                showDialog={this.showDialog}
              />
            </AccordionArticle>,
          );
        } else {
          articles.push(
            <Section
              config={value}
              id={`${compoundID}-Section`}
              key={`${compoundID}-Section`}
              semanticAs={topLevelSemanticAs}
              target={targetId}
              title={titleText}
              titleHTML={titleTextHTML}
            >
              <Explanation
                config={value}
                logError={this.logError}
                showDialog={this.showDialog}
              />
            </Section>,
          );
        }
        break;
      }
      case "Group": {
        const renderedGroupContent = [];
        const { content: groupContent = [] } = value;
        const { id: groupId, displayAsTabs = false } = value;

        if (!displayAsTabs) {
          // Children as sub-accordions/sections
          this.normaliseContentItems(groupContent).forEach((v) => {
            this.renderComponent(v, renderedGroupContent, null, renderContext);
          });

          if (expandable) {
            articles.push(
              <AccordionArticle
                expandedByDefault={autoExpandSingleAccordion}
                config={value}
                className={`group`}
                id={`${compoundID}-Group-Accordion`}
                key={`${compoundID}-Group-Accordion`}
                semanticAs="section"
                target={groupId}
                title={titleText}
                titleHTML={titleTextHTML}
              >
                {renderedGroupContent}
              </AccordionArticle>,
            );
          } else {
            const GroupSectionComponent = value.heroSection
              ? HeroSection
              : Section;
            articles.push(
              <GroupSectionComponent
                config={value}
                className={`group`}
                id={`${compoundID}-Group-Section`}
                key={`${compoundID}-Group-Section`}
                semanticAs={topLevelSemanticAs}
                target={groupId}
                title={titleText}
                titleHTML={titleTextHTML}
              >
                {renderedGroupContent}
              </GroupSectionComponent>,
            );
          }
        } else {
          // children rendered as tabs
          const tabItems = [];
          let defaultTabValue = null;

          this.normaliseContentItems(groupContent).forEach((v, index) => {
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

            const contentNode = this.renderComponentForTab(v);

            tabItems.push({
              content: contentNode,
              label: tabLabel,
              value: tabValue,
            });
          });

          const outerWrapper = (inner) =>
            expandable ? (
              <AccordionArticle
                expandedByDefault={autoExpandSingleAccordion}
                config={value}
                className={`group`}
                id={`${compoundID}-Group-Accordion`}
                key={`${compoundID}-Group-Accordion`}
                semanticAs="section"
                target={groupId}
                title={titleText}
                titleHTML={titleTextHTML}
              >
                {inner}
              </AccordionArticle>
            ) : (
              (() => {
                const GroupSectionComponent = value.heroSection
                  ? HeroSection
                  : Section;
                return (
                  <GroupSectionComponent
                    config={value}
                    className={`group`}
                    id={`${compoundID}-Group-Section`}
                    key={`${compoundID}-Group-Section`}
                    semanticAs={topLevelSemanticAs}
                    target={groupId}
                    title={titleText}
                    titleHTML={titleTextHTML}
                  >
                    {inner}
                  </GroupSectionComponent>
                );
              })()
            );

          articles.push(
            outerWrapper(
              <Tabs
                className="w-full overflow-hidden rounded-xl border border-border/45 bg-card/80"
                defaultValue={
                  defaultTabValue || (tabItems[0] && tabItems[0].value)
                }
              >
                <TabsList className="flex h-auto w-full flex-col items-stretch justify-start gap-0 overflow-visible rounded-lg border border-[color-mix(in_oklab,var(--chart-2)_62%,var(--foreground))] bg-muted/20 p-1 min-[1170px]:flex-wrap min-[1170px]:flex-row min-[1170px]:gap-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:border-b-2 min-[1170px]:border-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))] min-[1170px]:bg-muted/35 min-[1170px]:p-0">
                  {tabItems.map((item) => (
                    <TabsTrigger
                      className="w-full cursor-pointer justify-start rounded-md border border-transparent !px-4 !py-2 text-left !text-[calc(var(--font-size-sm)*1.2)] !leading-tight font-medium text-foreground/90 transition-colors duration-[800ms] ease-in-out hover:bg-[var(--accordion-mist)] hover:text-[var(--accordion-hover-text)] data-[state=active]:bg-[var(--accordion-mist)] data-[state=active]:text-[var(--accordion-hover-text)] data-[state=active]:font-bold data-[state=active]:border-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))] data-[state=active]:border-l-[5px] data-[state=active]:border-l-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))] data-[state=active]:rounded-none min-[1170px]:shrink-0 min-[1170px]:w-auto min-[1170px]:justify-center min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:border-r min-[1170px]:border-[color-mix(in_oklab,var(--chart-2)_62%,var(--foreground))] min-[1170px]:!min-h-[3.8rem] min-[1170px]:!px-6 min-[1170px]:!py-3 min-[1170px]:!text-[calc(var(--font-size-sm)*1.4)] min-[1170px]:text-center min-[1170px]:data-[state=active]:relative min-[1170px]:data-[state=active]:z-20 min-[1170px]:data-[state=active]:translate-y-[2px] min-[1170px]:data-[state=active]:bg-[var(--accordion-mist)] min-[1170px]:data-[state=active]:shadow-none min-[1170px]:data-[state=active]:rounded-t-[0.75rem] min-[1170px]:data-[state=active]:border-t-2 min-[1170px]:data-[state=active]:border-l-2 min-[1170px]:data-[state=active]:border-r-2 min-[1170px]:data-[state=active]:border-b-2 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))] min-[1170px]:data-[state=active]:!border-b-[color-mix(in_oklab,var(--muted)_25%,var(--card))]"
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabItems.map((item) => (
                  <TabsContent
                    className="mt-2 rounded-lg border border-[color-mix(in_oklab,var(--chart-2)_62%,var(--foreground))] bg-muted/20 p-4 data-[state=inactive]:hidden data-[state=active]:block min-[1170px]:mt-0 min-[1170px]:rounded-none min-[1170px]:border-0 min-[1170px]:bg-muted/25 min-[1170px]:data-[state=active]:rounded-b-[0.75rem] min-[1170px]:data-[state=active]:border-x-2 min-[1170px]:data-[state=active]:border-b-2 min-[1170px]:data-[state=active]:border-t-0 min-[1170px]:data-[state=active]:border-[color-mix(in_oklab,var(--chart-2)_78%,var(--foreground))]"
                    key={item.value}
                    value={item.value}
                    forceMount
                  >
                    {item.content}
                  </TabsContent>
                ))}
              </Tabs>,
            ),
          );
        }

        break;
      }
      case "MemoryMatchGame": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <MemoryMatchGame
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "Monologue": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <Monologue
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "PhraseTable": {
        if (expandable) {
          articles.push(
            <AccordionArticle
              expandedByDefault={autoExpandSingleAccordion}
              config={value}
              id={`${compoundID}-Accordion`}
              key={`${compoundID}-Accordion`}
              target={targetId}
              title={titleText}
              titleHTML={titleTextHTML}
            >
              <PhraseTable
                config={value}
                logError={this.logError}
                showDialog={this.showDialog}
                languageCode={languageCode}
              />
            </AccordionArticle>,
          );
        } else {
          articles.push(
            <Section
              config={value}
              id={`${compoundID}-Section`}
              key={`${compoundID}-Section`}
              semanticAs={topLevelSemanticAs}
              target={targetId}
              title={titleText}
              titleHTML={titleTextHTML}
            >
              <PhraseTable
                config={value}
                logError={this.logError}
                showDialog={this.showDialog}
                languageCode={languageCode}
              />
            </Section>,
          );
        }
        break;
      }
      case "RadioQuiz": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <RadioQuiz
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "ReadAloud": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <ReadAloud
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "SequenceOrder": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <SequenceOrder
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "Section": {
        const renderedSectionContent = [];
        const { content: sectionContent = [] } = value;

        this.normaliseContentItems(sectionContent).forEach((v) => {
          this.renderComponent(v, renderedSectionContent, null, renderContext);
        });

        const SectionComponent = value.heroSection ? HeroSection : Section;
        articles.push(
          <SectionComponent
            config={value}
            id={`${compoundID}-Section-Section`}
            key={`${compoundID}-Section-Section`}
            semanticAs={topLevelSemanticAs}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            {renderedSectionContent}
          </SectionComponent>,
        );
        break;
      }
      case "Sortable": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <Sortable
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "WordGrid": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <WordGrid
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      case "WordParts": {
        articles.push(
          <AccordionArticle
            expandedByDefault={autoExpandSingleAccordion}
            config={value}
            id={`${compoundID}-Accordion`}
            key={`${compoundID}-Accordion`}
            target={targetId}
            title={titleText}
            titleHTML={titleTextHTML}
          >
            <WordParts
              config={value}
              logError={this.logError}
              showDialog={this.showDialog}
            />
          </AccordionArticle>,
        );
        break;
      }
      default: {
        let CustomComponent;
        switch (languageCode) {
          case "fr":
            CustomComponent = AllCustomComponentsFR[component];
            break;
          default:
            CustomComponent = AllCustomComponentsFR[component];
            break;
        }
        if (CustomComponent) {
          if (expandable) {
            articles.push(
              <AccordionArticle
                expandedByDefault={autoExpandSingleAccordion}
                config={value}
                id={`${compoundID}-Accordion`}
                key={`${compoundID}-Accordion`}
                target={targetId}
                title={titleText}
                titleHTML={titleTextHTML}
              >
                <CustomComponent id={id} showDialog={this.showDialog} />
              </AccordionArticle>,
            );
          } else {
            articles.push(
              <Section
                config={value}
                id={`${compoundID}-Section`}
                key={`${compoundID}-Section`}
                semanticAs={topLevelSemanticAs}
                target={targetId}
                title={titleText}
                titleHTML={titleTextHTML}
              >
                <CustomComponent id={id} showDialog={this.showDialog} />
              </Section>,
            );
          }
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

  selectLearningObject = (index) => {
    this.setState({
      currentLearningObject: index,
    });
    sessionStorage.setItem("currentLearningObject", index);
  };

  showDialog = (content) => {
    this.setState({
      dialogContent: content,
      showDialog: true,
    });
  };
}
