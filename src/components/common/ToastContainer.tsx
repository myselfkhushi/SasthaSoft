"use client";

import React from "react";
import { useInventory } from "@/context/InventoryContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-800/80 shadow-emerald-950/20"
                : isError
                ? "bg-rose-950/90 text-rose-100 border-rose-800/80 shadow-rose-950/20"
                : isWarning
                ? "bg-amber-950/90 text-amber-100 border-amber-800/80 shadow-amber-950/20"
                : "bg-slate-900/95 text-slate-100 border-slate-700/80 shadow-slate-950/30"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight leading-snug">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs mt-1 text-slate-300/90 leading-relaxed break-words">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
