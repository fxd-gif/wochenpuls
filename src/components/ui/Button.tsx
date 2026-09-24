import Link from "next/link";
import type { ComponentProps } from "react";

// Ein Button für die ganze App. Mit "href" wird er zum Link.
const varianten = {
  primaer: "bg-primaer text-weiss hover:bg-primaer-dunkel",
  sekundaer: "bg-flaeche text-dunkel hover:bg-flaeche-dunkel",
  outline: "border-4 border-primaer text-primaer hover:bg-primaer hover:text-weiss",
  hell: "bg-weiss text-primaer hover:bg-primaer-hell",
  dunkel: "bg-dunkel text-weiss hover:bg-leise",
};

type Variante = keyof typeof varianten;

const basis =
  "inline-flex h-14 items-center justify-center gap-2 rounded-md px-7 text-base font-semibold " +
  "transition-all duration-200 hover:scale-105 active:scale-100 " +
  "disabled:pointer-events-none disabled:opacity-60";

export function buttonKlassen(variante: Variante = "primaer", extra = "") {
  return `${basis} ${varianten[variante]} ${extra}`;
}

type ButtonProps = ComponentProps<"button"> & { variante?: Variante };

export function Button({ variante, className = "", ...rest }: ButtonProps) {
  return <button className={buttonKlassen(variante, className)} {...rest} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variante?: Variante };

export function ButtonLink({ variante, className = "", ...rest }: ButtonLinkProps) {
  return <Link className={buttonKlassen(variante, className)} {...rest} />;
}
