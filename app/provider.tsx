"use client";

import { AuthContextProvider } from "@/context/AuthContext";

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

export default Provider;
