/** Root-relative-to-page assets also work on static project/subdirectory pages. */
export default function BrandEmblem() {
  const projectPage = /\/projects\/[^/]+\/?$/.test(window.location.pathname);
  const assetRoot = projectPage
    ? window.location.pathname.endsWith("/")
      ? "../../"
      : "../"
    : "./";
  return (
    <img
      className="brand-mark"
      src={`${assetRoot}xavic-emblem.svg`}
      width={33}
      height={33}
      alt=""
      aria-hidden="true"
    />
  );
}
