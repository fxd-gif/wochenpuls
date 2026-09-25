"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { anmelden } from "./aktionen";

export function LoginFormular() {
  const [fehler, aktion, laeuft] = useActionState(anmelden, null);
  return (
    <form action={aktion} className="mt-8">
      <label htmlFor="passwort" className="font-bold">
        Passwort
      </label>
      <input
        id="passwort"
        name="passwort"
        type="password"
        required
        autoComplete="current-password"
        aria-describedby={fehler ? "login-fehler" : undefined}
        className="mt-2 h-14 w-full rounded-md border-2 border-transparent bg-flaeche px-4 text-lg focus:border-primaer focus:bg-weiss focus:outline-none"
      />
      {fehler && (
        <p id="login-fehler" role="alert" className="mt-3 font-medium text-fehler">
          {fehler}
        </p>
      )}
      <Button type="submit" disabled={laeuft} className="mt-6 w-full">
        <LogIn size={20} strokeWidth={2.5} aria-hidden="true" />
        {laeuft ? "Wird geprüft …" : "Anmelden"}
      </Button>
    </form>
  );
}
