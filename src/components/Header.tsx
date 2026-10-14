import { useState } from "react";
import { Menu, X } from "lucide-react";
import BrandWordmark from "./BrandWordmark";
const links = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Laboratory", "laboratory"],
  ["Timeline", "timeline"],
  ["Contact", "contact"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <BrandWordmark />
      <nav
        id="primary-navigation"
        aria-label="Main navigation"
        className={open ? "nav open" : "nav"}
      >
        {links.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a className="github" href="#contact">
          Let’s connect
        </a>
      </nav>
      <button
        className="menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls="primary-navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
