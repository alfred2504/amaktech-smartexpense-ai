import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">

      {/* 🔥 NAVBAR */}
      <Navbar toggleSidebar={() => setOpen(!open)} />

      <div className="flex flex-1 overflow-hidden">

        {/* 🔥 DESKTOP SIDEBAR */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* 🔥 MOBILE SIDEBAR (DRAWER) */}
        {open && (
          <div className="fixed inset-0 z-50 flex">
            
            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* SIDEBAR */}
            <div className="w-64 bg-white dark:bg-gray-900 shadow-lg">
              <Sidebar />
            </div>
          </div>
        )}

        {/* 🔥 MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}