"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Image as ImageIcon } from "lucide-react";
import type { Announcement } from "@/types/database";

export function AnnouncementCard({ post }: { post: Announcement }) {
  const images = post.images || [];

  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
            <Calendar className="h-4 w-4" />
            {format(new Date(post.created_at), "MMMM d, yyyy")}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
            {post.title}
          </h2>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {images.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
              <ImageIcon className="h-4 w-4 text-slate-500" /> Attached Media ({images.length})
            </h3>
            
            <div className={`grid gap-4 ${
              images.length === 1 ? 'grid-cols-1 max-w-2xl' : 
              images.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2 md:grid-cols-3'
            }`}>
              {images.map((url, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <button className="relative group aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-white ring-1 ring-black/5 hover:ring-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={url} 
                        alt={`${post.title} image ${idx + 1}`} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] md:max-w-screen-lg max-h-[90vh] p-0 overflow-hidden bg-black/95 border-slate-800">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={url} 
                        alt={`${post.title} enlarged image ${idx + 1}`} 
                        className="max-w-full max-h-[85vh] object-contain rounded-md"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
