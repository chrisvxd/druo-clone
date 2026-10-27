"use client";

import { useState, type ReactNode, type Ref } from "react";
import type { SlotComponent } from "@puckeditor/core";
import { Icon, type IconName } from "./icons";

// Text props may arrive as ReactNode: Puck swaps contentEditable strings for
// editable elements inside the editor.
type Text = ReactNode;
type DragRef = Ref<any>;

export type Span = "1" | "2" | "3" | "full";

// Cards size themselves inside a Grid by column span.
const cls = (base: string, span?: Span) => `${base} p-span-${span || "1"}`;

const nums = (s?: string) =>
  (s || "")
    .split(",")
    .map((v) => parseFloat(v))
    .filter((v) => !Number.isNaN(v));

/* ------------------------------------------------------------------ layout */

export function Grid({ columns, gap, items: Items }: { columns: string; gap: string; items: SlotComponent }) {
  return <Items className={`p-grid p-grid--${columns} p-gap--${gap}`} />;
}

export function Panel({
  title,
  description,
  span,
  body: Body,
  dragRef,
}: {
  title: Text;
  description: Text;
  span?: Span;
  body: SlotComponent;
  dragRef?: DragRef;
}) {
  return (
    <section ref={dragRef} className={cls("p-card", span)}>
      <header className="p-card__head">
        <div>
          <h3 className="p-card__title">{title}</h3>
          {description ? <p className="p-card__desc">{description}</p> : null}
        </div>
      </header>
      <Body className="p-panel__body" />
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions: Actions,
}: {
  title: Text;
  subtitle: Text;
  actions: SlotComponent;
}) {
  return (
    <div className="p-pagehead">
      <div>
        <h1 className="p-pagehead__title">{title}</h1>
        {subtitle ? <p className="p-pagehead__sub">{subtitle}</p> : null}
      </div>
      <Actions className="p-pagehead__actions" allow={["PlatformButton"]} />
    </div>
  );
}

/* ----------------------------------------------------------------- buttons */

export function PlatformButton({
  label,
  href,
  variant,
  icon,
  dragRef,
}: {
  label: Text;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: IconName | "none";
  dragRef?: DragRef;
}) {
  return (
    <a ref={dragRef} className={`p-btn p-btn--${variant || "primary"}`} href={href || "#"}>
      {icon && icon !== "none" ? <Icon name={icon} size={14} /> : null}
      {label}
    </a>
  );
}

/* ------------------------------------------------------------------- stats */

function Sparkline({ values, trend }: { values: number[]; trend?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / range) * 24}`).join(" ");
  return (
    <svg className={`p-spark p-spark--${trend || "up"}`} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  caption,
  sparkline,
  span,
  dragRef,
}: {
  label: Text;
  value: Text;
  delta: Text;
  trend?: "up" | "down" | "flat";
  caption: Text;
  sparkline?: string;
  span?: Span;
  dragRef?: DragRef;
}) {
  return (
    <div ref={dragRef} className={cls("p-card p-stat", span)}>
      <p className="p-stat__label">{label}</p>
      <div className="p-stat__row">
        <p className="p-stat__value">{value}</p>
        <Sparkline values={nums(sparkline)} trend={trend} />
      </div>
      <p className="p-stat__foot">
        {delta ? <span className={`p-delta p-delta--${trend || "flat"}`}>{delta}</span> : null}
        <span>{caption}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ charts */

export function ChartCard({
  title,
  value,
  caption,
  kind,
  data,
  span,
  dragRef,
}: {
  title: Text;
  value: Text;
  caption: Text;
  kind?: "area" | "bar";
  data: { label: string; value: number }[];
  span?: Span;
  dragRef?: DragRef;
}) {
  const rows = (data || []).map((d) => ({ label: d.label, value: Number(d.value) || 0 }));
  const max = Math.max(1, ...rows.map((d) => d.value));
  // Label every other point once the axis gets crowded.
  const every = rows.length > 8 ? 2 : 1;

  return (
    <section ref={dragRef} className={cls("p-card p-chart", span)}>
      <header className="p-card__head">
        <div>
          <h3 className="p-card__title">{title}</h3>
          <p className="p-chart__value">{value}</p>
        </div>
        <p className="p-card__desc">{caption}</p>
      </header>
      <div className="p-chart__plot">
        {kind === "bar" ? (
          <div className="p-bars">
            {rows.map((d, i) => (
              <div key={i} className="p-bars__col" title={`${d.label}: ${d.value}`}>
                <div className="p-bars__bar" style={{ height: `${(d.value / max) * 100}%` }} />
              </div>
            ))}
          </div>
        ) : (
          <svg className="p-area" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="p-area-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#007881" stopOpacity="0.22" />
                <stop offset="1" stopColor="#007881" stopOpacity="0" />
              </linearGradient>
            </defs>
            {rows.length > 1 && (
              <>
                <path
                  d={`M0,100 ${rows.map((d, i) => `L${(i / (rows.length - 1)) * 100},${100 - (d.value / max) * 92}`).join(" ")} L100,100 Z`}
                  fill="url(#p-area-fill)"
                />
                <polyline
                  points={rows.map((d, i) => `${(i / (rows.length - 1)) * 100},${100 - (d.value / max) * 92}`).join(" ")}
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>
        )}
      </div>
      <div className={`p-chart__axis${kind === "bar" ? " p-chart__axis--bar" : ""}`}>
        {rows.map((d, i) => (
          <span key={i}>{i % every === 0 ? d.label : ""}</span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ transactions */

export type Transaction = {
  amount: Text;
  id: Text;
  status: "successful" | "pending" | "failed" | "refunded";
  customer: Text;
  method: Text;
  date: Text;
};

const STATUS_LABEL: Record<Transaction["status"], string> = {
  successful: "Successful",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export function StatusPill({ status }: { status: Transaction["status"] }) {
  return <span className={`p-pill p-pill--${status}`}>{STATUS_LABEL[status] || status}</span>;
}

export function TransactionsTable({
  title,
  rows,
  linkLabel,
  linkHref,
  span,
  dragRef,
}: {
  title: Text;
  rows: Transaction[];
  linkLabel: Text;
  linkHref?: string;
  span?: Span;
  dragRef?: DragRef;
}) {
  return (
    <section ref={dragRef} className={cls("p-card p-table-card", span)}>
      <header className="p-card__head">
        <h3 className="p-card__title">{title}</h3>
        {linkLabel ? (
          <a className="p-link" href={linkHref || "#"}>
            {linkLabel}
          </a>
        ) : null}
      </header>
      <div className="p-table-wrap">
        <table className="p-table">
          <thead>
            <tr>
              <th className="p-num">Amount</th>
              <th>Transaction</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Paid from</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r, i) => (
              <tr key={i}>
                <td className="p-num p-strong">{r.amount}</td>
                <td className="p-mono">{r.id}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
                <td>{r.customer}</td>
                <td className="p-muted">{r.method}</td>
                <td className="p-muted">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FilterBar({
  filters,
  searchPlaceholder,
  isEditing,
  dragRef,
}: {
  filters: { label: Text }[];
  searchPlaceholder: string;
  isEditing?: boolean;
  dragRef?: DragRef;
}) {
  const [active, setActive] = useState(0);
  return (
    <div ref={dragRef} className="p-filters p-span-full">
      <div className="p-filters__chips" role="tablist">
        {(filters || []).map((f, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`p-chip${i === active ? " p-chip--active" : ""}`}
            onClick={isEditing ? undefined : () => setActive(i)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="p-search p-search--inline">
        <Icon name="search" size={14} />
        <input placeholder={searchPlaceholder} readOnly={isEditing} />
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------- money */

export function BalanceCard({
  label,
  amount,
  account,
  caption,
  actionLabel,
  actionHref,
  tone,
  span,
  dragRef,
}: {
  label: Text;
  amount: Text;
  account: Text;
  caption: Text;
  actionLabel: Text;
  actionHref?: string;
  tone?: "dark" | "teal" | "mint";
  span?: Span;
  dragRef?: DragRef;
}) {
  return (
    <div ref={dragRef} className={cls(`p-card p-balance p-balance--${tone || "dark"}`, span)}>
      <p className="p-balance__label">{label}</p>
      <p className="p-balance__amount">{amount}</p>
      <p className="p-balance__account">
        <Icon name="bank" size={14} />
        {account}
      </p>
      <div className="p-balance__foot">
        <span>{caption}</span>
        {actionLabel ? (
          <a className="p-balance__action" href={actionHref || "#"}>
            {actionLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function BankAccounts({
  title,
  accounts,
  span,
  isEditing,
  dragRef,
}: {
  title: Text;
  accounts: { bank: Text; mask: Text; type: Text; color: string; enabled: boolean }[];
  span?: Span;
  isEditing?: boolean;
  dragRef?: DragRef;
}) {
  // Toggles are local on the site so the demo feels alive; data stays as authored.
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});
  return (
    <section ref={dragRef} className={cls("p-card", span)}>
      <header className="p-card__head">
        <h3 className="p-card__title">{title}</h3>
      </header>
      <ul className="p-banks">
        {(accounts || []).map((a, i) => {
          const on = overrides[i] ?? !!a.enabled;
          return (
            <li key={i} className="p-banks__row">
              <span className="p-banks__logo" style={{ background: a.color || "#007881" }}>
                <Icon name="bank" size={14} />
              </span>
              <span className="p-banks__name">
                <strong>
                  {a.bank} ••{a.mask}
                </strong>
                <span className="p-muted">{a.type}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label="Use for payouts"
                className={`p-switch${on ? " p-switch--on" : ""}`}
                onClick={isEditing ? undefined : () => setOverrides({ ...overrides, [i]: !on })}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------- activity */

const ACTIVITY_ICON: Record<string, IconName> = {
  payment: "payments",
  payout: "payouts",
  refund: "refund",
  alert: "alert",
  customer: "customers",
};

export function ActivityFeed({
  title,
  items,
  span,
  dragRef,
}: {
  title: Text;
  items: { kind: string; title: Text; meta: Text; time: Text }[];
  span?: Span;
  dragRef?: DragRef;
}) {
  return (
    <section ref={dragRef} className={cls("p-card", span)}>
      <header className="p-card__head">
        <h3 className="p-card__title">{title}</h3>
      </header>
      <ul className="p-feed">
        {(items || []).map((it, i) => (
          <li key={i} className="p-feed__item">
            <span className={`p-feed__icon p-feed__icon--${it.kind}`}>
              <Icon name={ACTIVITY_ICON[it.kind] || "payments"} size={14} />
            </span>
            <span className="p-feed__text">
              <strong>{it.title}</strong>
              <span className="p-muted">{it.meta}</span>
            </span>
            <span className="p-feed__time">{it.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ misc */

export function Notice({
  tone,
  title,
  text,
  linkLabel,
  linkHref,
  dragRef,
}: {
  tone?: "info" | "success" | "warning";
  title: Text;
  text: Text;
  linkLabel: Text;
  linkHref?: string;
  dragRef?: DragRef;
}) {
  return (
    <div ref={dragRef} className={`p-notice p-notice--${tone || "info"} p-span-full`}>
      <Icon name={tone === "warning" ? "alert" : tone === "success" ? "check" : "info"} size={16} />
      <p>
        <strong>{title}</strong> {text}
      </p>
      {linkLabel ? (
        <a className="p-link" href={linkHref || "#"}>
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}

export function DetailList({ items, dragRef }: { items: { label: Text; value: Text }[]; dragRef?: DragRef }) {
  return (
    <dl ref={dragRef} className="p-details">
      {(items || []).map((it, i) => (
        <div key={i} className="p-details__row">
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
