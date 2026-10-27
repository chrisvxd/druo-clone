"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { registerOverlayPortal, type SlotComponent } from "@puckeditor/core";

// Text props may arrive as ReactNode: Puck swaps contentEditable strings for
// editable elements inside the editor.
type Text = ReactNode;
type DragRef = Ref<any>;

const external = (href?: string) => (href && /^https?:/.test(href) ? { target: "_blank", rel: "noreferrer" } : {});

/* ----------------------------------------------------------------- button */

export type ButtonVariant = "primary" | "white" | "sand";

export function Button({
  label,
  href,
  variant,
  wide,
  dragRef,
}: {
  label: Text;
  href?: string;
  variant?: ButtonVariant;
  wide?: boolean;
  dragRef?: DragRef;
}) {
  return (
    <a
      ref={dragRef}
      className={`d-btn d-btn--${variant || "primary"}${wide ? " d-btn--wide" : ""}`}
      href={href || "#"}
      {...external(href)}
    >
      {label}
    </a>
  );
}

/* ------------------------------------------------------------------- hero */

export function Hero({
  title,
  lead,
  actions: Actions,
  note,
  faces,
  trust,
  image,
  imageAlt,
}: {
  title: Text;
  lead: Text;
  actions: SlotComponent;
  note: Text;
  faces: { image: string }[];
  trust: Text;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="d-hero">
      <div className="d-wrap d-hero__inner">
        <div className="d-hero__copy">
          <h1 className="d-h1 d-hero__title">{title}</h1>
          <h4 className="d-lead d-hero__lead">{lead}</h4>
          <Actions className="d-actions" allow={["Button"]} />
          <p className="d-hero__note">{note}</p>
          <div className="d-hero__trust">
            <div className="d-hero__faces">
              {(faces || []).map((f, i) => (
                <span key={i} style={{ backgroundImage: `url("${f.image}")` }} />
              ))}
            </div>
            <span>{trust}</span>
          </div>
        </div>
        <div className="d-hero__image">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- feature cards */

export function FeatureCard({
  image,
  imageAlt,
  title,
  text,
  dragRef,
}: {
  image: string;
  imageAlt: string;
  title: Text;
  text: Text;
  dragRef?: DragRef;
}) {
  return (
    <article ref={dragRef} className="d-card">
      <div className="d-card__media">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <h3 className="d-h3 d-card__title">{title}</h3>
      <p className="d-card__text">{text}</p>
    </article>
  );
}

function Intro({ title, lead, center }: { title: Text; lead?: Text; center?: boolean }) {
  return (
    <div className={`d-intro${center ? " d-intro--center" : ""}`}>
      <h2 className="d-h2">{title}</h2>
      {lead ? <h4 className="d-lead d-intro__lead">{lead}</h4> : null}
    </div>
  );
}

export function FeatureRow({ title, lead, cards: Cards }: { title: Text; lead: Text; cards: SlotComponent }) {
  return (
    <section className="d-section">
      <div className="d-wrap">
        <Intro title={title} lead={lead} />
        <Cards className="d-cards3" allow={["FeatureCard"]} />
      </div>
    </section>
  );
}

export function DarkFeatures({ title, lead, cards: Cards }: { title: Text; lead: Text; cards: SlotComponent }) {
  return (
    <section className="d-dark">
      <div className="d-wrap">
        <Intro title={title} lead={lead} center />
        <Cards className="d-cards2" allow={["FeatureCard"]} />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- checkout */

export function Checkout({
  title,
  lead,
  actions: Actions,
  image,
  imageAlt,
  sideImage,
  sideImageAlt,
}: {
  title: Text;
  lead: Text;
  actions: SlotComponent;
  image: string;
  imageAlt: string;
  sideImage: string;
  sideImageAlt: string;
}) {
  return (
    <section className="d-checkout">
      <div className="d-wrap d-checkout__inner">
        <div>
          <h2 className="d-h2">{title}</h2>
          <h4 className="d-lead d-checkout__lead">{lead}</h4>
          <Actions className="d-actions" allow={["Button"]} />
          <img className="d-checkout__phone" src={image} alt={imageAlt} loading="lazy" />
        </div>
        <div className="d-checkout__side">
          <img src={sideImage} alt={sideImageAlt} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- split band */

export function SplitBand({
  image,
  imageAlt,
  title,
  text,
  actions: Actions,
}: {
  image: string;
  imageAlt: string;
  title: Text;
  text: Text;
  actions: SlotComponent;
}) {
  return (
    <section className="d-band">
      <div className="d-wrap d-band__inner">
        <img src={image} alt={imageAlt} loading="lazy" />
        <div>
          <h2 className="d-h2">{title}</h2>
          <div className="d-rich d-band__text">{text}</div>
          <Actions className="d-actions" allow={["Button"]} />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- cta strip */

export function CtaStrip({ title, actions: Actions }: { title: Text; actions: SlotComponent }) {
  return (
    <section className="d-cta">
      <div className="d-wrap">
        <h2 className="d-h2 d-cta__title">{title}</h2>
        <Actions className="d-actions d-actions--center" allow={["Button"]} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- business card */

export function BusinessCard({
  eyebrow,
  title,
  text,
  actions: Actions,
  image,
  imageAlt,
}: {
  eyebrow: Text;
  title: Text;
  text: Text;
  actions: SlotComponent;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="d-biz">
      <div className="d-wrap">
        <div className="d-biz__card">
          <div>
            <h5 className="d-biz__eyebrow">{eyebrow}</h5>
            <h2 className="d-h2 d-biz__title">{title}</h2>
            <div className="d-rich d-biz__text">{text}</div>
            <Actions className="d-actions" allow={["Button"]} />
          </div>
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- faq */

export function FaqItem({
  question,
  answer,
  dragRef,
  isEditing,
}: {
  question: Text;
  answer: Text;
  dragRef?: DragRef;
  isEditing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const icon = useRef<HTMLButtonElement>(null);

  // Let the toggle receive clicks through Puck's overlay in the editor.
  useEffect(() => (icon.current ? registerOverlayPortal(icon.current, { disableDrag: true }) : undefined), []);

  return (
    <div ref={dragRef} className={`d-faq__item${open ? " d-faq__item--open" : ""}`}>
      <div
        className="d-faq__q"
        role={isEditing ? undefined : "button"}
        tabIndex={isEditing ? undefined : 0}
        aria-expanded={open}
        onClick={isEditing ? undefined : () => setOpen(!open)}
        onKeyDown={isEditing ? undefined : (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(!open))}
      >
        <h3 className="d-faq__q-text">{question}</h3>
        <button
          ref={icon}
          type="button"
          className="d-faq__icon"
          aria-label={open ? "Hide answer" : "Show answer"}
          tabIndex={isEditing ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        />
      </div>
      <div className="d-faq__a">
        <div>
          <div className="d-rich">{answer}</div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ title, items: Items }: { title: Text; items: SlotComponent }) {
  return (
    <section className="d-faq">
      <div className="d-wrap">
        <Intro title={title} center />
        <Items className="d-faq__list" allow={["FaqItem"]} />
      </div>
    </section>
  );
}
