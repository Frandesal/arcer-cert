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
        new Date(s.date_graduated).toLocaleDateString().includes(q)
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
              <Card className="border-slate-200/80 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover active:scale-[0.99]">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-lg">{student.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Graduated:{" "}
                    {new Date(student.date_graduated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </CardHeader>
            </Card>
          </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
