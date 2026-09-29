"use client";

import { getApps, initializeApp } from "firebase/app";
import {
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  inMemoryPersistence,
  initializeAuth,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";
import { Copy } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen } from "@/components/ui/stil";
import { mitGoogleAnmelden } from "./aktionen";

// Die öffentliche Web-Konfiguration von Firebase. Sie ist kein Geheimnis: Sie steht in jeder
// Firebase-Web-App im Browser. Die Datenbank bleibt trotzdem zu (nur der Server hat den Schlüssel).
let auth: Auth | undefined;
function firebaseAuth(): Auth {
  if (auth) return auth;
  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  // Nichts im Browser speichern: Die Sitzung hält der Server per Cookie.
  auth = initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  return auth;
}

// Browser in Apps wie LinkedIn oder Instagram: Google lässt dort keine Anmeldung zu.
const APP_BROWSER = /LinkedInApp|Instagram|FBAN|FBAV|FB_IAB|Line\/|MicroMessenger|TikTok|Snapchat|; wv\)/i;

function meldungZuFehler(code: string): string | null {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null; // selbst abgebrochen: keine Fehlermeldung nötig
    case "auth/popup-blocked":
      return "Dein Browser hat das Google-Fenster blockiert. Erlaube Pop-ups für diese Seite und tippe noch einmal auf den Knopf.";
    case "auth/network-request-failed":
      return "Keine Verbindung. Prüfe dein Internet und versuch es noch einmal.";
    case "auth/unauthorized-domain":
      return "Diese Adresse ist in Firebase noch nicht freigegeben (Authentication → Einstellungen → Autorisierte Domains).";
    case "auth/operation-not-allowed":
      return "Die Google-Anmeldung ist in Firebase noch nicht eingeschaltet (Authentication → Anmeldemethode → Google).";
    default:
      return "Die Anmeldung hat nicht geklappt. Bitte versuch es noch einmal.";
  }
}

export function LoginFormular() {
  const [code, setCode] = useState("");
  const [codeOffen, setCodeOffen] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [appBrowser, setAppBrowser] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [laeuft, starte] = useTransition();

  useEffect(() => {
    // erst im Browser bekannt, deshalb nach dem ersten Anzeigen
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppBrowser(APP_BROWSER.test(navigator.userAgent));
  }, []);

  async function anmelden() {
    setFehler(null);
    let idToken: string;
    try {
      const a = firebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const ergebnis = await signInWithPopup(a, provider);
      idToken = await ergebnis.user.getIdToken();
      await signOut(a);
    } catch (e) {
      setFehler(meldungZuFehler((e as { code?: string }).code ?? ""));
      return;
    }
    starte(async () => {
      const antwort = await mitGoogleAnmelden(idToken, code);
      // Bei Erfolg leitet der Server direkt auf /coach weiter
      if (antwort) {
        setFehler(antwort.fehler);
        if (antwort.codeNoetig) setCodeOffen(true);
      }
    });
  }

  async function linkKopieren() {
    try {
      await navigator.clipboard.writeText(location.href);
      setKopiert(true);
    } catch {
      setKopiert(false);
    }
  }

  return (
    <div className="mt-6">
      {appBrowser && (
        <div className="mb-6 rounded-subtil border border-linie-fokus bg-abschnitt p-4 text-[14px] leading-relaxed text-text-zwei">
          <p>
            Du bist im Browser einer App (z. B. LinkedIn). Google erlaubt hier keine Anmeldung. Öffne die
            Seite über das Menü (⋯) „Im Browser öffnen“ oder kopiere den Link in Chrome bzw. Safari.
          </p>
          <Button type="button" variante="sekundaer" groesse="klein" className="mt-3" onClick={linkKopieren}>
            <Copy size={15} strokeWidth={1.75} aria-hidden="true" />
            {kopiert ? "Link kopiert" : "Link kopieren"}
          </Button>
        </div>
      )}

      <Button type="button" variante="hell" className="w-full" disabled={laeuft} onClick={anmelden}>
        <GoogleLogo />
        {laeuft ? "Einen Moment …" : "Mit Google anmelden"}
      </Button>

      {fehler && (
        <p role="alert" className="mt-4 text-[14px] font-medium leading-relaxed text-ampel-rot">
          {fehler}
        </p>
      )}

      <details
        open={codeOffen}
        onToggle={(e) => setCodeOffen(e.currentTarget.open)}
        className="mt-6 border-t border-linie pt-2"
      >
        <summary className="cursor-pointer py-3 text-[14px] text-text-zwei hover:text-text">
          Neu hier? Einladungscode eingeben
        </summary>
        <label htmlFor="code" className="mt-2 block text-[13px] font-medium text-text">
          Einladungscode
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          placeholder="z. B. ABCD-EFGH"
          className={`${eingabeKlassen} mt-2 h-12 font-mono tracking-wider`}
        />
        <p className="mt-2 text-[13px] leading-relaxed text-text-leise">
          Nur beim ersten Mal nötig. Danach reicht „Mit Google anmelden“.
        </p>
      </details>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
