import { describe, expect, it } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("kodiert Umlaute, & und # im Text", () => {
    const url = whatsappLink("Hallo Jörg & Ana #1");
    expect(url).toBe("https://wa.me/?text=Hallo%20J%C3%B6rg%20%26%20Ana%20%231");
    expect(new URL(url).searchParams.get("text")).toBe("Hallo Jörg & Ana #1");
  });
});
