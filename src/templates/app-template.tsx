'use client'

import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function AppTemplate({ children } : { children: ReactNode; } ) {
  return (
    <>
      <Sidebar />
      <div className="h-full w-full">
        {children}
      </div>
    </>
  )
}