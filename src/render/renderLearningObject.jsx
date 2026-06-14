import {
  AccordionArticle,
  Explanation,
  Info,
  PhraseTable,
  Section,
} from "@/components/content";
import { HeroSection } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normaliseContentItems } from "@/lib/loConfig";

import {
  EXERCISE_REGISTRY,
  getLazyCustomComponent,
  withLazyBoundary,
} from "./lazyRegistry";

// Config-driven render dispatch for a learning object. Extracted out of the App
// component so the app shell stays a thin composition root: App resolves data +
// chrome and calls createRenderer(ctx).renderComponent(...) once per top-level
// section. The dispatch maps each config node's `component` string to a render
// (registry exercise → accordion-wrapped lazy element; Group → sub-accordions or
// tabs; Section → static shell; Explanation / PhraseTable → special cases;
// HIDE-prefixed → nothing; anything else → a lazily-resolved custom component
// with a "not implemented" fallback). Behaviour-identical to the prior in-App
// closures — the only structural change is that the per-render auto-id counter
// is now a closure variable owned by the renderer instance instead of a ref.

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

// Build a renderer bound to the current learning object's render context.
// One renderer is created per App render pass; its auto-id counter starts at 0
// each time (matching the old per-render ref reset) and persists across the
// multiple renderComponent calls within that pass so auto-generated ids stay
// unique within the tree.
export const createRenderer = ({
  currentLearningObject,
  languageCode,
  configGen,
}) => {
  let autoComponentIdCounter = 0;

  const getResolvedComponentId = (id, component) => {
    if (typeof id === "string" && id.trim() !== "") {
      return id.trim();
    }

    const safeComponent =
      typeof component === "string" && component.trim() !== ""
        ? component.trim()
        : "component";
    autoComponentIdCounter += 1;
    return `auto-${safeComponent}-${autoComponentIdCounter}`;
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

    // Registry dispatch: exercises rendered bare in a tab. Special cases
    // (Explanation, PhraseTable, custom) fall through to the switch. The
    // configGen-keyed remount replaces the old per-component config-reset effect.
    const RegisteredExercise = EXERCISE_REGISTRY[component];
    if (RegisteredExercise) {
      return withLazyBoundary(
        <RegisteredExercise key={`${id}-${configGen}`} config={value} />,
        `${id}-${configGen}`,
      );
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
        // Custom components resolve lazily; a missing key falls back to the
        // "not implemented" notice inside the lazy module (see
        // getLazyCustomComponent). HIDE-prefixed keys render nothing.
        if (component.slice(0, 4) === "HIDE") return null;
        const LazyCustom = getLazyCustomComponent(component);
        return (
          <>
            <Info
              informationText={tabInformationText}
              informationTextHTML={tabInformationTextHTML}
            />
            {withLazyBoundary(
              <LazyCustom config={value} id={id} />,
              `${id}-custom`,
            )}
          </>
        );
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
          children: withLazyBoundary(
            <RegisteredExercise
              key={`${compoundID}-${configGen}`}
              config={value}
            />,
            `${compoundID}-${configGen}`,
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
        if (component.slice(0, 4) === "HIDE") {
          // do nothing
          break;
        }
        // Custom components load lazily from the deferred custom chunk. A key
        // with no matching export resolves to the "not implemented" notice
        // inside the lazy module (see getLazyCustomComponent).
        const LazyCustom = getLazyCustomComponent(component);
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
            children: withLazyBoundary(
              <LazyCustom config={value} id={id} />,
              `${compoundID}-custom`,
            ),
          }),
        );
      }
    }
  };

  return { renderComponent, renderComponentForTab };
};
