/** One SVG asset keeps the wordmark emblem and favicon identical. */
export default function BrandEmblem() {
  return (
    <img
      className="brand-mark"
      src={`${import.meta.env.BASE_URL}xavic-emblem.svg`}
      width={33}
      height={33}
      alt=""
      aria-hidden="true"
    />
  );
}
