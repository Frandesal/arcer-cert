import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";

// Server Layout that isolates all internal admin pages to enforce the sidebar
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
          <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-[100vw] md:max-w-[calc(100vw-16rem)] overflow-x-hidden">
        {/* Mobile Interactive Header Navigation */}
        <AdminMobileNav />

        <main className="flex-1 w-full bg-slate-50/20">
            {children}
        </main>
      </div>
    </div>
  );
}
