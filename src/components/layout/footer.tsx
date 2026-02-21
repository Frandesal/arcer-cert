export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 sm:px-6">
        © {new Date().getFullYear()} Arcer. All rights reserved.
      </div>
    </footer>
  );
}
