'use client'

import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function AppTemplate({ children } : { children: ReactNode; } ) {
  return (
    <>

      <div className="h-full w-full flex flex-col animate-fade-up animate-delay-700">
        {children}
      </div>
    </>
  )
}