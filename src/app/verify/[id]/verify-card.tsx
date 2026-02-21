"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, GraduationCap } from "lucide-react";

type Student = {
  id: string;
  full_name: string;
  date_graduated: string;
};

export function VerifyCard({ student }: { student: Student }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-md"
    >
      <Card className="border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Certificate Verified
          </CardTitle>
          <p className="mt-2 text-slate-600">
            This certificate has been successfully verified and is registered to Arcer.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-sm font-medium text-slate-500">Graduate Name</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {student.full_name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-sm font-medium text-slate-500">Completion Date</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {new Date(student.date_graduated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-4 text-sm text-slate-500">
            <GraduationCap className="h-4 w-4" />
            <span>Registered with Arcer Certificate Verification</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
