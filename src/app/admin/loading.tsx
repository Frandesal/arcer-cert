import { Skeleton } from "@/components/ui/skeleton";
import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader />
      
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
            <div className="flex justify-between items-center mb-8">
               <Skeleton className="h-10 w-[250px]" />
               <Skeleton className="h-10 w-[140px]" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-[88px] w-full rounded-lg" />
              <Skeleton className="h-[88px] w-full rounded-lg" />
              <Skeleton className="h-[88px] w-full rounded-lg" />
              <Skeleton className="h-[88px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
