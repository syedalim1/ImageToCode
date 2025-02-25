import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Authentication from "./Authentication";

function AppHeader() {
  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full ">
      <SidebarTrigger />
  
      <Authentication />
    </div>
  );
}

export default AppHeader;
