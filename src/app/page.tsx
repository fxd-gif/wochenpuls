export default function Startseite() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-akzent">
          Wochenpuls
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Sieh auf einen Blick, welcher Kunde dich diese Woche braucht.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-leise">
          Ein Link pro Kunde, ein kurzes Check-in pro Woche, eine Ampel für
          alle. Gebaut für Coaches mit ihren ersten Kunden, ohne WhatsApp-Chaos
          und ohne teure Software.
        </p>
        <p className="mt-10 inline-block rounded-full bg-akzent-hell px-4 py-2 text-sm text-akzent-dunkel">
          Die Demo ist in Arbeit.
        </p>
      </div>
    </main>
  );
}
