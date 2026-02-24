import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-16 sm:px-6">
        {/* Generic skeleton loader layout */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-[350px] rounded-lg" />
          <Skeleton className="h-6 w-[200px] mb-12" />
          
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
