"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseCertificate } from "@/components/base-certificate";
import { DeleteStudentDialog } from "@/components/delete-student-dialog";
import { AdminStudentViewModal } from "@/components/admin-student-view-modal";
import { DownloadCertificateButton } from "@/components/download-certificate-button";
import { useCertificateGenerator, type CertificateStudentData } from "@/hooks/useCertificateGenerator";
import { FileDown, Loader2, X } from "lucide-react";

interface StudentRow {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_entered: string;
  date_graduated: string;
  modules_completed: { title: string; count: number }[];
}

interface StudentSelectionManagerProps {
  students: StudentRow[];
}

export function StudentSelectionManager({ students }: StudentSelectionManagerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  const {
    isGenerating,
    generatingStatus,
    renderingStudent,
    certificateRef,
    downloadBatchCertificates,
  } = useCertificateGenerator();

  const toggleStudent = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === students.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(students.map((s) => s.id)));
    }
  };

  const clearSelection = () => setSelected(new Set());

  const handleBulkDownload = async () => {
    const chosenStudents = students
      .filter((s) => selected.has(s.id))
      .map((s): CertificateStudentData => ({
        id: s.id,
        firstName: s.first_name,
        middleName: s.middle_name ?? "",
        lastName: s.last_name,
        dateEntered: s.date_entered,
        dateGraduated: s.date_graduated,
        modulesCompleted: s.modules_completed ?? [],
      }));

    await downloadBatchCertificates(
      chosenStudents,
      `Arcer_Certificates_${new Date().toISOString().split("T")[0]}.pdf`
    );

    setSelected(new Set());
  };

  // Derive unique graduation years for the filter
  const gradYears = Array.from(
    new Set(students.map((s) => new Date(s.date_graduated).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a));

  // Determine which students are visible based on filters
  const filteredStudents = students.filter((s) => {
    const d = new Date(s.date_graduated);
    const matchesYear = filterYear === "all" || d.getFullYear().toString() === filterYear;
    const matchesMonth =
      filterMonth === "all" || (d.getMonth() + 1).toString().padStart(2, "0") === filterMonth;
    return matchesYear && matchesMonth;
  });

  const allSelected = selected.size === filteredStudents.length && filteredStudents.length > 0;
  const someSelected = selected.size > 0;

  return (
    <>
      {/* Filters & Select All Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 pb-4">
        {filteredStudents.length > 0 ? (
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={toggleAll}
              aria-label="Select all students"
            />
            <label htmlFor="select-all" className="text-sm text-slate-500 cursor-pointer select-none">
              {allSelected ? "Deselect all" : `Select all (${filteredStudents.length})`}
            </label>
          </div>
        ) : (
          <div className="text-sm text-slate-500">No students match filters.</div>
        )}

        <div className="flex items-center gap-3">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[140px] shadow-sm">
              <SelectValue placeholder="Grad Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {gradYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[140px] shadow-sm">
              <SelectValue placeholder="Grad Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="01">January</SelectItem>
              <SelectItem value="02">February</SelectItem>
              <SelectItem value="03">March</SelectItem>
              <SelectItem value="04">April</SelectItem>
              <SelectItem value="05">May</SelectItem>
              <SelectItem value="06">June</SelectItem>
              <SelectItem value="07">July</SelectItem>
              <SelectItem value="08">August</SelectItem>
              <SelectItem value="09">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Student Rows */}
      <div className="space-y-3">
        {filteredStudents.map((s) => {
          const fullName = [s.first_name, s.middle_name, s.last_name]
            .filter(Boolean)
            .join(" ");
          const isChecked = selected.has(s.id);

          return (
            <Card
              key={s.id}
              className={`border-slate-200/80 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover group ${
                isChecked ? "border-primary/40 bg-primary/5" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleStudent(s.id)}
                    aria-label={`Select ${fullName}`}
                  />
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                      {fullName}
                    </p>
                    <p className="text-sm text-slate-600">
                      Graduated:{" "}
                      {new Date(s.date_graduated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AdminStudentViewModal
                    student={{
                      id: s.id,
                      fullName,
                      date_entered: s.date_entered,
                      date_graduated: s.date_graduated,
                      modules_completed: s.modules_completed,
                    }}
                  />
                  <DownloadCertificateButton
                    student={{
                      id: s.id,
                      firstName: s.first_name,
                      middleName: s.middle_name ?? "",
                      lastName: s.last_name,
                      dateEntered: s.date_entered,
                      dateGraduated: s.date_graduated,
                      modulesCompleted: s.modules_completed ?? [],
                    }}
                  />
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/students/${s.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteStudentDialog studentId={s.id} studentName={fullName} />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* ── Floating Bulk Action Bar ─────────────────────────── */}
      {someSelected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-2xl shadow-black/10 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-semibold text-slate-800">
            {selected.size} student{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-slate-200" />
          <Button
            size="sm"
            onClick={handleBulkDownload}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            {isGenerating ? generatingStatus : "Download PDF"}
          </Button>
          <button
            onClick={clearSelection}
            className="ml-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hidden Off-Screen Certificate Renderer for bulk downloads */}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        {renderingStudent && (
          <BaseCertificate data={renderingStudent} passRef={certificateRef} />
        )}
      </div>
    </>
  );
}
