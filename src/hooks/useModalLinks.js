import { useCallback, useEffect, useRef } from "react";

import { handleModalLinkClick } from "@/utils/dom";
import { MODAL_CONTENT_MAP } from "@/lib/modalContent";

// Encapsulates all modal-link behavior, extracted from App.jsx:
//   1. findModalLinkContent — resolve a target id to dialog content: the static
//      MODAL_CONTENT_MAP first, then the loaded LO config, then a DOM fallback.
//   2. normalizeModalLinkAnchors — keep `a.modal-link` anchors a11y-safe after
//      every render (store the semantic target in data-modal-target, use
//      `#content` as the fallback href).
//   3. Document-level click delegation — attached once on mount so links created
//      by child re-renders are always wired; capture phase so it still fires when
//      nested components stop bubble-phase propagation.
//
// `config` is mirrored into a ref so the long-lived (mount-attached) delegated
// handler always sees the current LO config instead of a stale mount snapshot.
export function useModalLinks({ config, showModalLinkDialog }) {
  const configRef = useRef(null);
  configRef.current = config;

  // Doc-level modal-link delegation: attach once on mount, remove on unmount.
  const modalLinkDelegationSetupRef = useRef(false);
  const handleDelegatedModalLinkClickRef = useRef(null);
  const handleDelegatedModalTargetClickRef = useRef(null);

  const findModalLinkContent = useCallback((targetId) => {
    const cfg = configRef.current;

    if (MODAL_CONTENT_MAP[targetId]) return MODAL_CONTENT_MAP[targetId];
    if (!cfg) {
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

    Object.values(cfg).forEach((section) => {
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
  }, []);

  // Idempotent re-scan: normalize hash modal links so accessibility tooling does
  // not flag them as broken same-page anchors. We keep the semantic target in
  // `data-modal-target` and use `#content` as safe fallback href. Runs after
  // every render so links created by child re-renders are always normalized.
  const normalizeModalLinkAnchors = useCallback(() => {
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
  }, []);

  // Re-scan modal-link anchors after every render so links produced by child
  // re-renders stay normalized (matches the legacy componentDidUpdate call).
  useEffect(() => {
    normalizeModalLinkAnchors();
  });

  // `modal-link` is reserved for content links that open the modal dialog.
  // Main navigation uses `nav-scroll-link` and handles scroll behavior in MainMenu.
  // Use delegated listeners so links created by child re-renders are always wired.
  useEffect(() => {
    if (!modalLinkDelegationSetupRef.current) {
      const onModalLinkClick = (e) => {
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
          findModalLinkContent: findModalLinkContent,
          linkEl: anchor,
          showModalLinkDialog: showModalLinkDialog,
        });
      };

      const onModalTargetClick = (e) => {
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

      handleDelegatedModalLinkClickRef.current = onModalLinkClick;
      handleDelegatedModalTargetClickRef.current = onModalTargetClick;

      // Use capture phase so modal links still work when nested components stop
      // propagation during bubble phase (for example Section content wrappers).
      document.addEventListener("click", onModalLinkClick, true);
      document.addEventListener("click", onModalTargetClick, true);
      modalLinkDelegationSetupRef.current = true;
    }

    return () => {
      if (modalLinkDelegationSetupRef.current) {
        document.removeEventListener(
          "click",
          handleDelegatedModalLinkClickRef.current,
          true,
        );
        document.removeEventListener(
          "click",
          handleDelegatedModalTargetClickRef.current,
          true,
        );
        modalLinkDelegationSetupRef.current = false;
      }
    };
    // Mount-only: findModalLinkContent and showModalLinkDialog are stable
    // (useCallback); the handler reads live config via configRef. Re-running
    // would detach/reattach listeners needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
