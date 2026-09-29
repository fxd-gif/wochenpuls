import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Hinweisseite } from "@/components/ui/Hinweisseite";
import { anmeldungEingerichtet, istAngemeldet } from "@/lib/server/anmeldung";
import { LoginFormular } from "./LoginFormular";

export const metadata: Metadata = {
  title: "Coach-Login · Wochenpuls",
  robots: { index: false },
};

export default async function LoginSeite({ searchParams }: PageProps<"/login">) {
  if (await istAngemeldet()) redirect("/coach");
  const geloescht = (await searchParams).konto === "geloescht";

  return (
    <Hinweisseite kicker="Coach-Bereich" titel="Anmelden">
      {geloescht && (
        <p
          role="status"
          className="mt-3 rounded-subtil border border-linie-fokus bg-abschnitt p-4 text-[14px] text-text"
        >
          Dein Konto wurde gelöscht, samt aller Kunden und Check-ins.
        </p>
      )}
      {anmeldungEingerichtet() ? (
        <>
          <p className="mt-3 text-[15px] leading-relaxed text-text-zwei">
            Melde dich mit deinem Google-Konto an. Neue Coaches brauchen beim ersten Mal einen Einladungscode,
            den gibt es über{" "}
            <a
              href="https://www.linkedin.com/in/schmidt-frederik"
              className="text-akzent underline underline-offset-4"
            >
              LinkedIn
            </a>
            .
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-zwei">
            Hinweise zur Verarbeitung deiner Daten findest du in der{" "}
            <Link href="/datenschutz" className="text-akzent underline underline-offset-4">
              Datenschutzerklärung
            </Link>
            .
          </p>
          <LoginFormular />
        </>
      ) : (
        <p>
          Der Login ist noch nicht eingerichtet. Bis dahin kannst du dir die{" "}
          <Link href="/demo" className="text-akzent underline underline-offset-4">
            Demo
          </Link>{" "}
          ansehen.
        </p>
      )}
    </Hinweisseite>
  );
}
