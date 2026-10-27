"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { fontVariables } from "../../lib/fonts";
import { LOGO_WHITE } from "../../lib/site";
import { Icon, type IconName } from "./icons";

export type NavItem = { label: string; href: string; icon: IconName };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export function PlatformShell({
  children,
  merchant,
  user,
  environment,
  nav,
  isEditing,
}: {
  children: ReactNode;
  merchant: string;
  user: string;
  environment: "live" | "sandbox";
  nav: NavItem[];
  isEditing: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // The editor lives at <page>/edit, so match nav items without that suffix.
  const path = (usePathname() || "/").replace(/\/edit$/, "") || "/";
  const activeHref = (nav || [])
    .map((n) => n.href)
    .filter((h) => h && (path === h || path.startsWith(h + "/")))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <div
      className={`p-app ${fontVariables}${menuOpen ? " p-app--menu" : ""}`}
      // In the editor, links shouldn't navigate away from the canvas.
      onClickCapture={isEditing ? (e) => (e.target as HTMLElement).closest("a") && e.preventDefault() : undefined}
    >
      <aside className="p-side">
        <a className="p-side__logo" href="/platform" aria-label="DRUO dashboard">
          <img src={LOGO_WHITE} alt="DRUO" />
        </a>
        <button type="button" className="p-side__merchant">
          <span className="p-avatar p-avatar--teal">{initials(merchant)}</span>
          <span className="p-side__merchant-name">
            <strong>{merchant}</strong>
            <span>Merchant account</span>
          </span>
          <Icon name="chevron" size={14} />
        </button>
        <nav className="p-side__nav" aria-label="Dashboard">
          {(nav || []).map((item) => {
            const external = /^https?:/.test(item.href);
            return (
              <a
                key={item.label + item.href}
                href={item.href}
                className={`p-side__link${item.href === activeHref ? " p-side__link--active" : ""}`}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {external ? <Icon name="external" size={12} /> : null}
              </a>
            );
          })}
        </nav>
        <div className="p-side__foot">
          <a className="p-side__link" href="https://druo.com/en/contact-us/">
            <Icon name="info" />
            <span>Help &amp; support</span>
          </a>
        </div>
      </aside>

      <div className="p-main">
        <header className="p-top">
          <button type="button" className="p-top__menu" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name="menu" size={18} />
          </button>
          <label className="p-search">
            <Icon name="search" size={14} />
            <input placeholder="Search payments, customers, IDs…" readOnly={isEditing} />
            <kbd>/</kbd>
          </label>
          <div className="p-top__right">
            <span className={`p-env p-env--${environment}`}>{environment === "live" ? "Live" : "Sandbox"}</span>
            <button type="button" className="p-top__icon" aria-label="Notifications">
              <Icon name="bell" />
              <i className="p-top__dot" />
            </button>
            <span className="p-avatar" title={user}>
              {initials(user)}
            </span>
          </div>
        </header>
        <main className="p-content">{children}</main>
      </div>
      <div className="p-scrim" onClick={() => setMenuOpen(false)} />
    </div>
  );
}
