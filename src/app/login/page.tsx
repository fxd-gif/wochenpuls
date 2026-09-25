import { Activity } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { anmeldungEingerichtet, istAngemeldet } from "@/lib/server/anmeldung";
import { LoginFormular } from "./LoginFormular";

export const metadata: Metadata = {
  title: "Coach-Login · Wochenpuls",
  robots: { index: false },
};

export default async function LoginSeite() {
  if (await istAngemeldet()) redirect("/coach");

  return (
    <main className="flex flex-1 items-center justify-center bg-flaeche px-4 py-16">
      <div className="w-full max-w-md rounded-lg bg-weiss p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-primaer text-weiss">
          <Activity size={24} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Coach-Login</h1>
        {anmeldungEingerichtet() ? (
          <LoginFormular />
        ) : (
          <p className="mt-4 text-lg leading-relaxed text-leise">
            Der Login ist noch nicht eingerichtet. Bis dahin kannst du dir die{" "}
            <Link href="/demo" className="font-semibold text-primaer underline underline-offset-4">
              Demo
            </Link>{" "}
            ansehen.
          </p>
        )}
      </div>
    </main>
  );
}
