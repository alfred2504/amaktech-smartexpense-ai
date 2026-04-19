import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SiteFooter from "./SiteFooter";

export default function AppLayout({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar toggleSidebar={() => setOpen(!open)} />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {open && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="flex-1 bg-slate-900/55 backdrop-blur-[1px]"
              onClick={() => setOpen(false)}
            />

            <div className="h-full w-72 shadow-2xl shadow-slate-900/30">
              <Sidebar
                showCloseButton
                onClose={() => setOpen(false)}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col gap-8">
            {children}
            <SiteFooter className="mt-auto pb-2" />
          </div>
        </main>
      </div>
    </div>
  );
}