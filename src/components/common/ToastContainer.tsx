"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border bg-white transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? "border-[#228181]/40 shadow-[#228181]/10"
                : isError
                ? "border-[#D78EAB]/60 shadow-[#D78EAB]/10"
                : isWarning
                ? "border-[#B85D19]/40 shadow-[#B85D19]/10"
                : "border-[#EAE4E3] shadow-slate-200"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#228181]" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#D78EAB]" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-[#B85D19]" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#165353]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#1C2727] leading-snug">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs mt-0.5 text-slate-600 leading-relaxed break-words font-medium">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#FAF8F7] active:scale-90 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
