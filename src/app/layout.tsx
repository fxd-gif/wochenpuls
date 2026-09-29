import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import { ModusSchalter, modusSkript } from "@/components/ModusSchalter";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const beschreibung = "Wöchentliche Check-ins für Fitness-Coaches: ein Link pro Kunde, eine Ampel für alle.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wochenpuls.vercel.app"),
  title: "Wochenpuls",
  description: beschreibung,
  openGraph: {
    title: "Wochenpuls – Wer braucht dich diese Woche?",
    description: beschreibung,
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      // Das Skript im <head> setzt data-theme vor React; das ist gewollt
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modusSkript }} />
      </head>
      {/* Die Startseite hat einen eigenen Fuß (id "startfuss"): Dann entfällt dieser schmale Fuß */}
      <body className="flex min-h-full flex-col [&>#startfuss~footer]:hidden">
        {children}
        <footer className="flex flex-wrap items-center justify-center border-t border-linie px-5 py-5 text-[13px] text-text-leise">
          <Link
            href="/datenschutz"
            className="inline-flex min-h-11 items-center px-3 transition-colors hover:text-text"
          >
            Datenschutz
          </Link>
          <Link
            href="/avv"
            className="inline-flex min-h-11 items-center px-3 transition-colors hover:text-text"
          >
            Vertrag zur Auftragsverarbeitung
          </Link>
          <ModusSchalter />
        </footer>
      </body>
    </html>
  );
}
