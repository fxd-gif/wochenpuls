import Link from "next/link";
import type { ComponentProps } from "react";

// Ein Button für die ganze App. Mit "href" wird er zum Link.
const varianten = {
  primaer: "bg-akzent text-auf-akzent hover:bg-akzent-hover",
  hell: "bg-text text-leinwand hover:bg-text/90",
  sekundaer: "border border-linie-fokus bg-flaeche-alt text-text hover:bg-flaeche-hoch",
  ghost: "text-text-zwei hover:bg-flaeche hover:text-text",
  gefahr: "bg-ampel-rot text-auf-akzent hover:bg-ampel-rot/90",
};

const groessen = {
  normal: "h-12 px-6 text-[14px]",
  klein: "h-11 px-4 text-[13px]",
};

type Variante = keyof typeof varianten;
type Groesse = keyof typeof groessen;

const basis =
  "inline-flex items-center justify-center gap-2 rounded-subtil font-semibold whitespace-nowrap " +
  "transition-colors duration-150 active:scale-[0.98] [&_svg]:shrink-0 " +
  "disabled:pointer-events-none disabled:opacity-50";

export function buttonKlassen(variante: Variante = "primaer", groesse: Groesse = "normal", extra = "") {
  return `${basis} ${varianten[variante]} ${groessen[groesse]} ${extra}`;
}

type ButtonProps = ComponentProps<"button"> & { variante?: Variante; groesse?: Groesse };

export function Button({ variante, groesse, className = "", ...rest }: ButtonProps) {
  return <button className={buttonKlassen(variante, groesse, className)} {...rest} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variante?: Variante; groesse?: Groesse };

export function ButtonLink({ variante, groesse, className = "", ...rest }: ButtonLinkProps) {
  return <Link className={buttonKlassen(variante, groesse, className)} {...rest} />;
}
