const MAIN_MENU_ELEMENT_ID = "mainMenu";
const ACTIVATION_OFFSET = 140;
const PENDING_TARGET_TOLERANCE = 8;

export const getMenuHighlightKey = (targetId) =>
  targetId === "introduction" ? "menuItem-introduction" : `menuItem-${targetId}`;

const getNavAnchor = (targetId) =>
  document.getElementById(`${targetId}-heading`) ||
	document.getElementById(targetId);

export const resolveMainMenuHighlight = ({ config, pendingNavTarget }) => {
  const mainMenu = document.getElementById(MAIN_MENU_ELEMENT_ID);
  if (!mainMenu || !config) {
    return {
      menuHighlight: null,
      pendingNavTarget,
    };
  }

  const mainMenuRect = mainMenu.getBoundingClientRect();
  const mainMenuBottom = mainMenuRect.bottom;
  const activationLine = mainMenuBottom + ACTIVATION_OFFSET;
  let nextPendingNavTarget = pendingNavTarget;
  const passed = [];

  if (nextPendingNavTarget) {
    const pendingTarget = getNavAnchor(nextPendingNavTarget);
    if (pendingTarget) {
      const pendingRect = pendingTarget.getBoundingClientRect();
      if (pendingRect.top > activationLine + PENDING_TARGET_TOLERANCE) {
        return {
          menuHighlight: getMenuHighlightKey(nextPendingNavTarget),
          pendingNavTarget: nextPendingNavTarget,
        };
      }
    }
    nextPendingNavTarget = null;
  }

  const introEl = getNavAnchor("introduction");
  if (introEl) {
    const rect = introEl.getBoundingClientRect();
    if (rect.top <= activationLine) {
      passed.push({
        key: "menuItem-introduction",
        top: rect.top,
      });
    }
  }

  for (const [, value] of Object.entries(config)) {
    const { id } = value;
    const target = getNavAnchor(id);
    if (!target) continue;

    const rect = target.getBoundingClientRect();
    if (rect.top <= activationLine) {
      passed.push({
        key: `menuItem-${id}`,
        top: rect.top,
      });
    }
  }

  passed.sort((a, b) => b.top - a.top);

  return {
    menuHighlight: passed.length > 0 ? passed[0].key : null,
    pendingNavTarget: nextPendingNavTarget,
  };
};
