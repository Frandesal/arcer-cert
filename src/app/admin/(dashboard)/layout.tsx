import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Menu } from "lucide-react";

// Server Layout that isolates all internal admin pages to enforce the sidebar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
          <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-[100vw] md:max-w-[calc(100vw-16rem)] overflow-x-hidden">
        {/* Mobile Header fallback inside the layout content side */}
        <header className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sticky top-0 z-40">
           <span className="font-bold text-slate-900 tracking-tight">Arcer Admin</span>
           <button className="p-2 -mr-2 text-slate-600">
               <Menu className="h-6 w-6" />
           </button>
        </header>

        <main className="flex-1 w-full bg-slate-50/20">
            {children}
        </main>
      </div>
    </div>
  );
}
