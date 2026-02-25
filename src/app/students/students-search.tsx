"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronRight, GraduationCap, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const initialYear = searchParams.get("year") || "all";
  const initialMonth = searchParams.get("month") || "all";

  const [query, setQuery] = useState("");
  const [yearState, setYearState] = useState(initialYear);
  const [monthState, setMonthState] = useState(initialMonth);

  // Derive unique years from the dataset for the dropdown
  const uniqueYears = useMemo(() => {
    const years = initialStudents.map((s) => new Date(s.date_graduated).getFullYear().toString());
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
  }, [initialStudents]);

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const updateUrl = (newYear: string, newMonth: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (newYear === "all") params.delete("year");
    else params.set("year", newYear);

    if (newMonth === "all") params.delete("month");
    else params.set("month", newMonth);

    router.replace(`/students?${params.toString()}`, { scroll: false });
  };

  const handleYearChange = (val: string) => {
    setYearState(val);
    updateUrl(val, monthState);
  };

  const handleMonthChange = (val: string) => {
    setMonthState(val);
    updateUrl(yearState, val);
  };

  const clearFilters = () => {
      setYearState("all");
      setMonthState("all");
      setQuery("");
      router.replace(`/students`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let result = initialStudents;

    // Filter by Year
    if (yearState !== "all") {
      result = result.filter((s) => new Date(s.date_graduated).getFullYear().toString() === yearState);
    }

    // Filter by Month
    if (monthState !== "all") {
      result = result.filter((s) => new Date(s.date_graduated).getMonth().toString() === monthState);
    }

    // Filter by Search Query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          new Date(s.date_graduated).toLocaleDateString().includes(q),
      );
    }
    
    return result;
  }, [initialStudents, query, yearState, monthState]);

  // Determine the dynamic header based on filters
  const getHeaderTitle = () => {
     if (yearState === "all" && monthState === "all") return "Graduates Directory";
     
     let title = "Class of ";
     if (monthState !== "all") {
         const monthName = months.find(m => m.value === monthState)?.label;
         title += `${monthName} `;
     }
     if (yearState !== "all") {
         title += yearState;
     } else {
         title += "Graduates";
     }
     return title;
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            {getHeaderTitle()}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-10 shadow-sm bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
                <Select value={yearState} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[120px] bg-white shadow-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={monthState} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[140px] bg-white shadow-sm">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(yearState !== "all" || monthState !== "all" || query) && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} className="text-slate-500 hover:text-red-500 transition-colors" title="Clear Filters">
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>
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
