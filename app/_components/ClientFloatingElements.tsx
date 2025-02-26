"use client";

import FloatingElements from "./FloatingElements";
import ClientOnly from "../view-code/_components/ClientOnly";

export default function ClientFloatingElements() {
  return (
    <ClientOnly>
      <FloatingElements />
    </ClientOnly>
  );
}
