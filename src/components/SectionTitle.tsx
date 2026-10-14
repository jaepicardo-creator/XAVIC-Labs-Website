import type { ReactNode } from "react";
export default function SectionTitle({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{label}</div>
        <h2>
          {title}
          <span>.</span>
        </h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}
