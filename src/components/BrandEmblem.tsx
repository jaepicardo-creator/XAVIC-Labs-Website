/** Root-relative-to-page assets also work on static project/subdirectory pages. */
export default function BrandEmblem({
  className = "brand-mark",
  size = 33,
}: {
  className?: string;
  size?: number;
}) {
  const projectPage = /\/projects\/[^/]+\/?$/.test(window.location.pathname);
  const assetRoot = projectPage
    ? window.location.pathname.endsWith("/")
      ? "../../"
      : "../"
    : "./";
  return (
    <img
      className={className}
      src={`${assetRoot}xavic-emblem.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}
