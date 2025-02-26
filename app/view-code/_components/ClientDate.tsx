"use client";

import { ReactNode } from "react";
import ClientOnly from "./ClientOnly";

interface ClientDateProps {
  date: string | number | Date;
  format?: "local" | "year";
  fallback?: ReactNode;
}

export default function ClientDate({ 
  date, 
  format = "local", 
  fallback = "..." 
}: ClientDateProps) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  let formattedDate: string;
  
  switch (format) {
    case "year":
      formattedDate = dateObj.getFullYear().toString();
      break;
    case "local":
    default:
      formattedDate = dateObj.toLocaleDateString();
      break;
  }
  
  return (
    <ClientOnly fallback={fallback}>
      {formattedDate}
    </ClientOnly>
  );
}
