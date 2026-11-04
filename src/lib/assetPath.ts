const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL path for files in `public/`, works on GitHub Pages and locally. */
export function assetPath(path: string): string {
  const normalized = path.replace(/^\//, "");
  const encoded = normalized
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return basePath ? `${basePath}/${encoded}` : `/${encoded}`;
}
