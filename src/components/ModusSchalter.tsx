"use client";

import { Moon, Sun } from "lucide-react";

const schluessel = "wochenpuls-modus";

// Läuft im <head>, bevor die Seite gezeichnet wird: So blitzt beim Laden nie die falsche Farbe auf.
// Ohne eigene Wahl gilt die Einstellung des Geräts (hell oder dunkel).
export const modusSkript = `try{var m=localStorage.getItem("${schluessel}");if(m==="hell"||(!m&&matchMedia("(prefers-color-scheme: light)").matches))document.documentElement.dataset.theme="light"}catch(e){}`;

function umschalten() {
  const html = document.documentElement;
  const hell = html.dataset.theme !== "light";
  const setzen = () => {
    if (hell) html.dataset.theme = "light";
    else delete html.dataset.theme;
  };
  try {
    localStorage.setItem(schluessel, hell ? "hell" : "dunkel");
  } catch {}
  // Weiches Überblenden, wo der Browser es kann und niemand "Bewegung reduzieren" eingestellt hat
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!ruhig && document.startViewTransition) document.startViewTransition(setzen);
  else setzen();
}

// Sonne/Mond-Knopf. Welches Symbol sichtbar ist, entscheidet CSS (hell:…), nicht React,
// damit Server und Browser dasselbe zeichnen.
export function ModusSchalter({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={umschalten}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-subtil text-text-zwei transition-colors hover:bg-flaeche hover:text-text ${className}`}
    >
      <Sun size={18} strokeWidth={1.75} aria-hidden="true" className="hell:hidden" />
      <Moon size={18} strokeWidth={1.75} aria-hidden="true" className="hidden hell:block" />
      <span className="sr-only hell:hidden">Hellen Modus einschalten</span>
      <span className="hidden sr-only hell:inline">Dunklen Modus einschalten</span>
    </button>
  );
}
