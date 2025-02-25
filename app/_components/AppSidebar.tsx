import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  CircleDollarSign,
  Home,
  Inbox,
  Paintbrush,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { log } from "console";

const items = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Design",
    url: "/designs",
    icon: Paintbrush,
  },
  {
    title: "Credits",
    url: "/credits",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  const path = usePathname();
  console.log(path);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4  items-center justify-center ">
          <h2 className="text-2xl text-center  font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Img2Code
          </h2>
          <h2 className="text-sm text-gray-400 text-center">Build Awesome</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item, index) => (
                <a
                  href={item.url}
                  key={index}
                  className={`p-2 text-lg flex gap-2 items-center hover:bg-gray-100 rounded-lg ${
                    path == item.url && `bg-gray-200`
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <h2 className="p-2 text-gray-400 text-sm">Copyright @Syed Ali M</h2>
      </SidebarFooter>
    </Sidebar>
  );
}
