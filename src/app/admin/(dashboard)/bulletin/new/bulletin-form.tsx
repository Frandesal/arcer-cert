"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UploadCloud, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface BulletinFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    images: string[];
    is_published: boolean;
  };
}

export function BulletinForm({ initialData }: BulletinFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!initialData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);
  
  // Existing uploaded images (urls)
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  // Pending local files for upload
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPendingFiles((prev) => [...prev, ...newFiles]);
      
      // Generate immediate local previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePendingFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove: string) => {
    setImages((prev) => prev.filter(url => url !== urlToRemove));
  };

  const uploadFiles = async () => {
    if (pendingFiles.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of pendingFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `announcements/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('bulletin_images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('bulletin_images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!title.trim() || !content.trim()) {
        throw new Error("Title and content are required.");
      }

      // 1. Upload any new pending files
      const newUploadedUrls = await uploadFiles();
      const finalImageArray = [...images, ...newUploadedUrls];

      // 2. Save to database
      const payload = {
        title,
        content,
        images: finalImageArray,
        is_published: isPublished,
      };

      if (isEditing) {
        const { error: dbError } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", initialData.id);
        
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("announcements")
          .insert(payload);
        
        if (dbError) throw dbError;
      }

      router.push("/admin/bulletin");
      router.refresh();
      
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-card">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-semibold">Announcement Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                placeholder="e.g. 2025 Arcer Graduation Ceremony"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11 bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-slate-700 font-semibold">Content Details <span className="text-destructive">*</span></Label>
              <Textarea
                id="content"
                placeholder="Write the full announcement here. You can use multiple paragraphs..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px] resize-y bg-slate-50/50 leading-relaxed"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" /> Attached Images
                </Label>
              </div>
              
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100/50 transition-colors">
                <UploadCloud className="h-8 w-8 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">Click to upload images</p>
                <p className="text-xs text-slate-500 mb-4">PNG, JPG, or WEBP up to 5MB each</p>
                
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-white border border-slate-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    Browse Files
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              {/* Image Preview Grid */}
              {(images.length > 0 || previewUrls.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Existing upload ${idx}`} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 shadow-lg"
                          onClick={() => removeExistingImage(url)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {previewUrls.map((url, idx) => (
                    <div key={`pending-${idx}`} className="relative group aspect-video rounded-lg overflow-hidden border border-primary/30 bg-primary/5 ring-2 ring-primary/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Pending upload ${idx}`} className="object-cover w-full h-full opacity-80" />
                      <div className="absolute top-1 left-1 bg-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</div>
                      <button
                        type="button"
                        onClick={() => removePendingFile(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6">
               <button
                 type="button"
                 onClick={() => setIsPublished(!isPublished)}
                 className={`relative flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                   isPublished ? "bg-primary" : "bg-slate-200"
                 }`}
               >
                 <span
                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                     isPublished ? "translate-x-6" : "translate-x-1"
                   }`}
                 />
               </button>
               <div>
                 <Label className="text-sm font-semibold text-slate-800 cursor-pointer" onClick={() => setIsPublished(!isPublished)}>Publish immediately</Label>
                 <p className="text-xs text-slate-500">If unchecked, this post will be saved as a draft.</p>
               </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/bulletin")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isEditing ? "Save Changes" : "Create Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
