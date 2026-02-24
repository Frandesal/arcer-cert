"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronRight } from "lucide-react";

type StudentRow = {
  id: string;
  full_name: string;
  date_graduated: string;
};

export function StudentsSearch({
  initialStudents,
}: {
  initialStudents: StudentRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return initialStudents;
    const q = query.toLowerCase().trim();
    return initialStudents.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        new Date(s.date_graduated).toLocaleDateString().includes(q),
    );
  }, [initialStudents, query]);

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or graduation date..."
            className="pl-10 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Showing {filtered.length} of {initialStudents.length} graduates
        </p>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && initialStudents.length > 0 && (
          <p className="py-8 text-center text-slate-600">
            No graduates match your search. Try a different query.
          </p>
        )}
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Link href={`/students/${student.id}`}>
              <Card className="group relative overflow-hidden border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md active:scale-[0.99] sm:p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="relative flex flex-row items-center justify-between py-4 pr-6 sm:py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary">
                        {student.full_name}
                      </CardTitle>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Graduated:{" "}
                        <span className="text-slate-600">
                          {new Date(student.date_graduated).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 opacity-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
