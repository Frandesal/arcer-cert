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
import { FileUp, Loader2, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import { BaseCertificate } from "./base-certificate";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CsvRow {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_graduated?: string;
  modules_completed: string; // We expect JSON string in the CSV e.g., [{"title":"React","count":1}]
}

export function CsvImportModal() {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const [error, setError] = useState("");
  
  // State to hold the current student data being rendered in the hidden dom element
  const [renderingStudent, setRenderingStudent] = useState<any>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        } catch (err: any) {
          setError(err.message || "An error occurred during processing.");
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setError("Failed to parse CSV: " + error.message);
        setIsProcessing(false);
      }
    });
  };

  const processCsvData = async (data: CsvRow[]) => {
    if (data.length === 0) {
      throw new Error("The CSV file is empty.");
    }

    setProgressStatus(`Saving ${data.length} students to database...`);
    const supabase = createClient();

    // Map the CSV rows into the exact database schema format
    const inserts = data.map((row) => {
        let modules = [];
        try {
           modules = row.modules_completed ? JSON.parse(row.modules_completed) : [];
        } catch(e) {
           console.error("Invalid JSON in modules_completed column for", row.first_name);
        }
        
        return {
            first_name: row.first_name,
            middle_name: row.middle_name || "",
            last_name: row.last_name,
            date_graduated: row.date_graduated || new Date().toISOString(),
            date_entered: new Date().toISOString(),
            modules_completed: modules,
        }
    });

    const { data: insertedRecords, error: dbError } = await supabase
      .from("students")
      .insert(inserts)
      .select();

    if (dbError) throw new Error("Database insertion failed: " + dbError.message);
    if (!insertedRecords) throw new Error("No records returned from database.");

    setProgressStatus("Generating certificates... Please don't close this window.");
    
    // Initialize the zip file
    const zip = new JSZip();

    // Loop through each inserted record, render it, and snap a picture
    for (let i = 0; i < insertedRecords.length; i++) {
        const student = insertedRecords[i];
        
        setProgressStatus(`Rendering certificate ${i + 1} of ${insertedRecords.length} (${student.first_name} ${student.last_name})...`);
        
        // 1. Set state to mount the component with this student's data
        // We wrap in a promise to wait for React to finish rendering the DOM
        await new Promise<void>((resolve) => {
            setRenderingStudent({
                id: student.id,
                firstName: student.first_name,
                middleName: student.middle_name,
                lastName: student.last_name,
                dateGraduated: student.date_graduated,
                modulesCompleted: student.modules_completed,
            });
            // Give React and the QR Code canvas a tiny moment to paint the DOM
            setTimeout(resolve, 300); 
        });

        // 2. Snap the picture
        if (certificateRef.current) {
            try {
                // Generate a high quality PNG blob
                const dataUrl = await toPng(certificateRef.current, {
                   pixelRatio: 1, // 1 is enough since our base div is already 2000px wide
                   cacheBust: true,
                });
                
                // Convert base64 dataUrl to blob for jszip
                const base64Data = dataUrl.split(",")[1];
                const fileName = `${student.first_name}_${student.last_name}_Certificate.png`.replace(/\s+/g, '_');
                
                zip.file(fileName, base64Data, { base64: true });
            } catch (snapError) {
                console.error("Failed to snapshot certificate for " + student.first_name, snapError);
            }
        }
    }

    setProgressStatus("Packaging ZIP file...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    setProgressStatus("Downloading...");
    saveAs(zipBlob, `Arcer_Graduates_${new Date().toISOString().split('T')[0]}.zip`);

    setIsProcessing(false);
    setProgressStatus("");
    setRenderingStudent(null);
    setOpen(false); // Close modal on success
    
    // Refresh the page to show the newly added students in the list
    window.location.reload();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => {
         if(!isProcessing) setOpen(val);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 font-medium bg-white hover:bg-slate-50 border-slate-300">
            <FileUp className="h-4 w-4" />
            Bulk Import (.csv)
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CSV Bulk Import</DialogTitle>
            <DialogDescription>
              Upload a .csv file of graduates. The system will create their profiles and automatically download a .zip containing their generated graphical certificates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
             {error && (
                 <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                     {error}
                 </div>
             )}

             {!isProcessing ? (
               <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-12 hover:bg-slate-50 hover:border-primary/50 cursor-pointer transition-colors"
               >
                 <div className="text-center">
                   <FileUp className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                   <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                     <span className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-emerald-500">
                       Upload a file
                     </span>
                     <p className="pl-1">or drag and drop</p>
                   </div>
                   <p className="text-xs leading-5 text-slate-500">CSV file containing graduate data</p>
                 </div>
                 <input
                     ref={fileInputRef}
                     type="file"
                     accept=".csv"
                     className="hidden"
                     onChange={handleFileUpload}
                 />
               </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm font-medium text-slate-700 animate-pulse">{progressStatus}</p>
                    <p className="text-xs text-slate-500 text-center">This may take a minute depending on the batch size. Please do not close or refresh this tab.</p>
                </div>
             )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Render Pipeline */}
      {/* This element must be in the DOM to be snapshotted, but we hide it visually off-screen */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", pointerEvents: "none", zIndex: -9999 }}>
         {renderingStudent && (
             <BaseCertificate data={renderingStudent} passRef={certificateRef} />
         )}
      </div>
    </>
  );
}
