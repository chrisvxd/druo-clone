"use client";

import { useState, type ReactNode } from "react";
import { fontVariables } from "../../lib/fonts";
import { FOOTER_COLUMNS, LOGO, LOGO_WHITE, NAV, SITE } from "../../lib/site";

function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="d-header">
        <div className="d-wrap d-header__inner">
          <a className="d-header__logo" href="/" aria-label="DRUO home">
            <img src={LOGO} alt="DRUO" />
          </a>
          <nav className="d-header__nav" aria-label="Main">
            {NAV.map((item) => (
              <a key={item.label} className="d-header__link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="d-header__right">
            <a className="d-header__contact" href={SITE.contact}>
              Contact Us
            </a>
            <a className="d-btn d-btn--primary d-header__cta" href={SITE.getStarted}>
              Get Started
            </a>
          </div>
          <button
            className="d-header__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`d-menu${open ? " d-menu--open" : ""}`}>
        {NAV.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href={SITE.contact}>Contact Us</a>
        <a className="d-btn d-btn--primary" href={SITE.getStarted}>
          Get Started
        </a>
      </div>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="d-footer">
      <div className="d-wrap d-footer__inner">
        <div className="d-footer__brand">
          <a className="d-footer__logo" href="/" aria-label="DRUO home">
            <img src={LOGO_WHITE} alt="DRUO" />
          </a>
          <p className="d-footer__tagline">Pay straight from your bank account, wherever you are.</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <strong className="d-footer__head">{col.heading}</strong>
            <ul className="d-footer__links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="d-footer__bar">
        <p>© {new Date().getFullYear()} DRUO, Inc.</p>
      </div>
    </footer>
  );
}

export function SiteShell({ children, isEditing }: { children: ReactNode; isEditing: boolean }) {
  return (
    <div
      className={`d-site ${fontVariables}`}
      // In the editor, links shouldn't navigate away from the canvas.
      onClickCapture={isEditing ? (e) => (e.target as HTMLElement).closest("a") && e.preventDefault() : undefined}
    >
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
