import React from 'react'
import {
  ClerkProvider,
 
} from "@clerk/nextjs";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClerkProvider>{ children }</ClerkProvider>;
}

