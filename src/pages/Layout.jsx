
import React from "react";
import Sidebar from "./components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Base44Provider } from "./components/contexts/Base44Context";

export default function Layout({ children, currentPageName }) {
  return (
    <Base44Provider>
      <div className="flex h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-auto ml-64">
          {children}
        </main>
        <Toaster />
      </div>
    </Base44Provider>
  );
}
