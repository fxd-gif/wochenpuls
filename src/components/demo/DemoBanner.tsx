import Link from "next/link";

// Gelber Streifen über jeder Demo-Seite
export function DemoBanner() {
  return (
    <div className="bg-akzent text-dunkel">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm font-medium sm:px-6 lg:px-8">
        <span>
          <strong className="font-bold uppercase tracking-wider">Demo</strong> · Alle Daten sind erfunden
        </span>
        <Link href="/" className="font-semibold underline underline-offset-4 hover:no-underline">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
