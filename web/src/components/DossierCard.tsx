import React from "react";

export default function DossierCard({
  title,
  subtitle,
  children,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-6 shadow-xl shadow-amber-400/10">
      {(title || subtitle) && (
        <header className="mb-4 space-y-1">
          {title && <div className="text-2xl font-bold">{title}</div>}
          {subtitle && <div className="text-amber-300">{subtitle}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
