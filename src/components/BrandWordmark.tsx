import BrandEmblem from "./BrandEmblem";
/** The same accessible horizontal lockup is used on home and project pages. */
export default function BrandWordmark({ href = "#" }: { href?: string }) {
  return (
    <a className="brand" href={href} aria-label="XAVIC-Labs home">
      <BrandEmblem />
      XAVIC<span className="muted">/ LABS</span>
    </a>
  );
}
