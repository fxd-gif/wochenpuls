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

export default async function LoginSeite() {
  if (await istAngemeldet()) redirect("/coach");

  return (
    <Hinweisseite kicker="Coach-Bereich" titel="Anmelden">
      {anmeldungEingerichtet() ? (
        <LoginFormular />
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
