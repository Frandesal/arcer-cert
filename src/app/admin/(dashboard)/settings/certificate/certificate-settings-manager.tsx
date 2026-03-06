"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BaseCertificate } from "@/components/base-certificate";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";
import { CertificateLayoutConfig, defaultCertificateLayout } from "@/types/certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCcw, Loader2, Check } from "lucide-react";

const previewStudent: CertificateStudentData = {
  id: "preview-12345",
  firstName: "Jane",
  middleName: "Marie",
  lastName: "Doe",
  dateEntered: "2024-01-15",
  dateGraduated: "2024-05-20",
  hours: 120,
  modulesCompleted: [
    { title: "Microsoft Word", count: 10 },
    { title: "Adobe Photoshop", count: 15 }
  ]
};

export function CertificateSettingsManager({ initialLayout }: { initialLayout: CertificateLayoutConfig }) {
  const [layout, setLayout] = useState<CertificateLayoutConfig>(initialLayout);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = (section: keyof CertificateLayoutConfig, field: string, value: string) => {
    setLayout((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificate_settings")
        .upsert({ id: 1, layout_config: layout });

      if (error) throw error;
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTextOverlayControls = (title: string, section: keyof CertificateLayoutConfig) => {
    const config = layout[section] as any;
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
               <Label className="text-xs text-slate-500">Top Position</Label>
               <Input 
                 value={config.top || ""} 
                 onChange={(e) => handleUpdate(section, "top", e.target.value)} 
                 placeholder="e.g. 1000px" 
                 className="h-8 text-sm"
               />
             </div>
             <div className="space-y-1.5">
               <Label className="text-xs text-slate-500">Left Position</Label>
               <Input 
                 value={config.left || ""} 
                 onChange={(e) => handleUpdate(section, "left", e.target.value)} 
                 placeholder="e.g. 500px or 0" 
                 className="h-8 text-sm"
               />
             </div>
             <div className="space-y-1.5 col-span-2">
               <Label className="text-xs text-slate-500">Font Size</Label>
               <Input 
                 value={config.fontSize || ""} 
                 onChange={(e) => handleUpdate(section, "fontSize", e.target.value)} 
                 placeholder="e.g. 30px" 
                 className="h-8 text-sm"
               />
             </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-full">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Left Side: Controls Panel */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col pt-2 pb-6 max-h-full">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-900">Layout Controls</h2>
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setLayout(defaultCertificateLayout)}
               className="h-8 gap-1 text-xs"
             >
               <RefreshCcw className="w-3 h-3" /> Reset
             </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6 stylish-scrollbar pb-10">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="text">Text Elements</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4 mt-0">
                {renderTextOverlayControls("Student Name", "name")}
                {renderTextOverlayControls("Start Date", "startDate")}
                {renderTextOverlayControls("End Date", "endDate")}
                {renderTextOverlayControls("Total Hours", "hours")}
                {renderTextOverlayControls("Given Day (___ day of)", "givenDay")}
                {renderTextOverlayControls("Given Month/Year", "givenMonthYear")}
              </TabsContent>

              <TabsContent value="qr" className="mt-0">
                <Card className="shadow-sm border-slate-200/80">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-slate-800">QR Code Box</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Bottom Position</Label>
                        <Input 
                          value={layout.qrCode.bottom} 
                          onChange={(e) => handleUpdate("qrCode", "bottom", e.target.value)} 
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Left Position</Label>
                        <Input 
                          value={layout.qrCode.left} 
                          onChange={(e) => handleUpdate("qrCode", "left", e.target.value)} 
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <Label className="text-xs text-slate-500">QR Size</Label>
                        <Input 
                          value={layout.qrCode.size} 
                          onChange={(e) => handleUpdate("qrCode", "size", e.target.value)} 
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                         <Label className="text-xs text-slate-500">Text Bottom</Label>
                         <Input 
                           value={layout.qrCode.textBottom} 
                           onChange={(e) => handleUpdate("qrCode", "textBottom", e.target.value)} 
                           className="h-8 text-sm"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <Label className="text-xs text-slate-500">Text Size</Label>
                         <Input 
                           value={layout.qrCode.textFontSize} 
                           onChange={(e) => handleUpdate("qrCode", "textFontSize", e.target.value)} 
                           className="h-8 text-sm"
                         />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="pt-4 mt-auto border-t border-slate-200">
             {saveStatus === "error" && <p className="text-xs text-red-500 mb-2">{errorMessage}</p>}
             <Button 
               onClick={handleSave} 
               disabled={isSaving} 
               className={`w-full gap-2 transition-all ${saveStatus === "success" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
             >
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === "success" ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
               {isSaving ? "Saving..." : saveStatus === "success" ? "Saved Successfully" : "Save Live Layout"}
             </Button>
          </div>
        </div>

        {/* Right Side: Live Certificate Preview Canvas */}
        <div className="flex-1 rounded-2xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-auto shadow-inner relative min-h-[500px] lg:min-h-0">
          {/* We scale the 2200x1700 certificate down so it fits visually on the screen */}
          <div className="relative transform origin-center scale-[0.25] sm:scale-[0.35] lg:scale-[0.4] xl:scale-[0.45] shadow-2xl transition-transform">
             <BaseCertificate data={previewStudent} layout={layout} />
          </div>
          
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 flex items-center gap-2 pointer-events-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700 tracking-wide">Live Preview</span>
          </div>
        </div>

      </div>
    </div>
  );
}
