"use client"

import * as React from "react"
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { UserNav } from "./user-nav"
import { MainNav } from "./main-nav"
import { Icons } from "../icons"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Icons.logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold font-headline">RH-Full</h1>
              </div>
              <div className="p-2 -mr-2 hidden group-data-[collapsible=icon]:block">
                 <Icons.logo className="h-6 w-6 text-primary" />
              </div>
            </div>
            <MainNav />
          </div>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="flex items-center space-x-2 lg:hidden">
                <SidebarTrigger />
                 <Icons.logo className="h-6 w-6 text-primary" />
                 <span className="font-bold">RH-Full</span>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
