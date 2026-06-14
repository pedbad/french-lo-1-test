/**
 * Fallback shown before any learning object resolves (state.languageCode still
 * undefined). Hints the slug-path URL form for opening an LO.
 */
export function NoConfigNotice() {
  const { host, pathname } = window.location;

  return (
    <div className="no-config">
      <h1>No learning object selected</h1>
      <h2>{`${host}${pathname}first-contact/`}</h2>
      <p>
        Open a learning object by slug path. If absent, the landing page is
        shown.
      </p>
    </div>
  );
}
