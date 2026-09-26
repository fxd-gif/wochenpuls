"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { eingabeKlassen } from "@/components/ui/stil";
import { anmelden } from "./aktionen";

export function LoginFormular() {
  const [fehler, aktion, laeuft] = useActionState(anmelden, null);
  return (
    <form action={aktion} className="mt-6">
      <label htmlFor="passwort" className="text-[13px] font-medium text-text">
        Passwort
      </label>
      <input
        id="passwort"
        name="passwort"
        type="password"
        required
        autoComplete="current-password"
        aria-describedby={fehler ? "login-fehler" : undefined}
        className={`${eingabeKlassen} mt-2 h-12`}
      />
      {fehler && (
        <p id="login-fehler" role="alert" className="mt-3 text-[14px] font-medium text-ampel-rot">
          {fehler}
        </p>
      )}
      <Button type="submit" disabled={laeuft} className="mt-6 w-full">
        <LogIn size={17} strokeWidth={2} aria-hidden="true" />
        {laeuft ? "Wird geprüft …" : "Anmelden"}
      </Button>
    </form>
  );
}
