import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AVV_GEAENDERT } from "@/lib/server/anmeldung";

// Oben auf allen Coach-Seiten, solange der Coach der aktuellen Fassung des Vertrags noch nicht zugestimmt hat
export function AvvHinweis({ zustimmen }: { zustimmen: () => Promise<void> }) {
  return (
    <div role="status" className="border-b border-akzent/30 bg-akzent/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 lg:px-8">
        <p className="flex-1 basis-64 text-[14px] font-medium">
          {AVV_GEAENDERT}{" "}
          <Link href="/avv" className="text-akzent underline underline-offset-4">
            Vertrag lesen
          </Link>
          . Bis du zustimmst, kannst du keine neuen Kunden anlegen.
        </p>
        <form action={zustimmen}>
          <Button type="submit" groesse="klein">
            Zustimmen
          </Button>
        </form>
      </div>
    </div>
  );
}
