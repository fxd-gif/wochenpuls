// Öffnet WhatsApp mit vorbereitetem Text; den Empfänger wählt der Coach dort aus.
export function whatsappLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
