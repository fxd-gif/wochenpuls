import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { anmeldungPruefen } from "@/lib/server/anmeldung";
import { alleEinladungen } from "@/lib/server/datenbank";
import { coachKontoLoeschen, einladungErzeugen, einladungLoeschen } from "./aktionen";
import { Einladungen } from "./Einladungen";

export const metadata: Metadata = { title: "Einladungscodes · Wochenpuls", robots: { index: false } };

export default async function EinladungenSeite() {
  const coach = await anmeldungPruefen();
  if (!coach.istAdmin) notFound();
  const liste = await alleEinladungen();
  return <Einladungen liste={liste} erzeugen={einladungErzeugen} loeschen={einladungLoeschen} kontoLoeschen={coachKontoLoeschen} />;
}
