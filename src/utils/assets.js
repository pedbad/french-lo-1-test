export const resolveAsset = (path = '') => {
  if (!path) return path;
  // Do not alter absolute URLs.
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = `${path}`.startsWith('/') ? `${path}`.slice(1) : `${path}`;
  // Mac-origin audio file names are often NFD; normalize requests to match on-disk assets.
  const normalizedPathNfd = normalizedPath.normalize('NFD');
  // If already resolved against BASE_URL, just URI-encode it.
  if (`${path}`.startsWith(normalizedBase)) return encodeURI(`${path}`.normalize('NFD'));
  return encodeURI(`${normalizedBase}${normalizedPathNfd}`);
};

export const resolveAssetHTML = (html) => {
  const base = import.meta.env.BASE_URL || '/';
  return html.replace(/(src|href)=["'](?!https?:\/\/)([^"']+)["']/g, (match, attr, path) => {
    const resolved = path.startsWith(base) ? path : `${base}${path}`;
    return `${attr}="${resolved}"`;
  });
};
