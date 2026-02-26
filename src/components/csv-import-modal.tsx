"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUp, Loader2, Download } from "lucide-react";
import Papa from "papaparse";
import { BaseCertificate } from "./base-certificate";
import { useCertificateGenerator } from "@/hooks/useCertificateGenerator";

// The new simplified CSV format — one column per module, no JSON needed
interface CsvRow {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_graduated?: string;
  // Individual module count columns (the number for each module, or blank)
  ms_word?: string;
  ms_excel?: string;
  ms_powerpoint?: string;
  adobe_photoshop?: string;
  canva?: string;
}

// Maps CSV column names to their display titles on the certificate
const MODULE_COLUMNS: { key: keyof CsvRow; title: string }[] = [
  { key: "ms_word", title: "MS Word" },
  { key: "ms_excel", title: "MS Excel" },
  { key: "ms_powerpoint", title: "MS PowerPoint" },
  { key: "adobe_photoshop", title: "Adobe Photoshop" },
  { key: "canva", title: "Canva" },
];

export function CsvImportModal() {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    renderingStudent,
    certificateRef,
    downloadBatchCertificates,
  } = useCertificateGenerator();

  const handleDownloadTemplate = () => {
    // Build a template where each module has its own column — no JSON needed!
    const header = "first_name,middle_name,last_name,date_graduated,ms_word,ms_excel,ms_powerpoint,adobe_photoshop,canva";
    const example1 = "John,D,Doe,2024-05-20,12,8,10,5,15";
    const example2 = "Jane,,Smith,2024-05-20,20,15,18,,10";
    const csvContent = "data:text/csv;charset=utf-8," + [header, example1, example2].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Arcer_CSV_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsProcessing(true);
    setProgressStatus("Parsing CSV file...");

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await processCsvData(results.data);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "An error occurred during processing.";
          setError(message);
          setIsProcessing(false);
        }
      },
      error: (parseError) => {
        setError("Failed to parse CSV: " + parseError.message);
        setIsProcessing(false);
      },
    });
  };

  const processCsvData = async (data: CsvRow[]) => {
    if (data.length === 0) {
      throw new Error("The CSV file is empty.");
    }

    setProgressStatus(`Saving ${data.length} students to database...`);
    const supabase = createClient();

    // Map CSV rows to the database schema, converting columns to module objects
    const inserts = data.map((row) => {
      const modules_completed = MODULE_COLUMNS
        .filter((m) => row[m.key] && row[m.key]!.trim() !== "")
        .map((m) => ({
          title: m.title,
          count: parseInt(row[m.key]!, 10) || 0,
        }));

      return {
        first_name: row.first_name?.trim() || "",
        middle_name: row.middle_name?.trim() || "",
        last_name: row.last_name?.trim() || "",
        date_graduated: row.date_graduated?.trim() || new Date().toISOString(),
        date_entered: new Date().toISOString(),
        modules_completed,
      };
    });

    const { data: insertedRecords, error: dbError } = await supabase
      .from("students")
      .insert(inserts)
      .select();

    if (dbError) throw new Error("Database insertion failed: " + dbError.message);
    if (!insertedRecords || insertedRecords.length === 0)
      throw new Error("No records returned from database.");

    setProgressStatus("Generating certificates...");

    // Map inserted records to the certificate format
    const students = insertedRecords.map((s) => ({
      id: s.id,
      firstName: s.first_name,
      middleName: s.middle_name || "",
      lastName: s.last_name,
      dateEntered: s.date_entered,
      dateGraduated: s.date_graduated,
      modulesCompleted: (s.modules_completed as { title: string; count: number }[]) ?? [],
    }));

    await downloadBatchCertificates(students);

    setIsProcessing(false);
    setProgressStatus("");
    setOpen(false);
    window.location.reload();
  };

  const combinedIsProcessing = isProcessing;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!combinedIsProcessing) setOpen(val);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 font-medium bg-white hover:bg-slate-50 border-slate-300"
          >
            <FileUp className="h-4 w-4" />
            Bulk Import (.csv)
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>CSV Bulk Import</DialogTitle>
            <DialogDescription>
              Upload a .csv file of graduates. The system will create their profiles and
              automatically download a .zip containing their generated certificates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            {!combinedIsProcessing ? (
              <div className="space-y-4">
                {/* Format Guide */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm space-y-2">
                  <p className="font-semibold text-slate-800">CSV Column Format</p>
                  <p className="text-slate-500 text-xs">Each module has its own column — just enter the number of sessions. Leave blank if not taken.</p>
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full mt-1">
                      <thead>
                        <tr className="text-slate-400">
                          <th className="text-left pr-3 pb-1 font-medium">first_name</th>
                          <th className="text-left pr-3 pb-1 font-medium">last_name</th>
                          <th className="text-left pr-3 pb-1 font-medium">date_graduated</th>
                          <th className="text-left pr-3 pb-1 font-medium">ms_word</th>
                          <th className="text-left pr-3 pb-1 font-medium">ms_excel</th>
                          <th className="text-left pr-3 pb-1 font-medium">canva</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-slate-600">
                          <td className="pr-3">John</td>
                          <td className="pr-3">Doe</td>
                          <td className="pr-3">2024-05-20</td>
                          <td className="pr-3">12</td>
                          <td className="pr-3">8</td>
                          <td className="pr-3">15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="text-primary h-auto p-0 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download Pre-filled Template (.csv)
                  </Button>
                </div>

                {/* Upload Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <FileUp className="mx-auto h-10 w-10 text-slate-300" />
                    <div className="mt-3 flex text-sm leading-6 text-slate-600 justify-center">
                      <span className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-emerald-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">CSV file only</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-700 animate-pulse">
                  {progressStatus}
                </p>
                <p className="text-xs text-slate-500 text-center">
                  Please do not close or refresh this tab.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Off-Screen Certificate Renderer */}
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
