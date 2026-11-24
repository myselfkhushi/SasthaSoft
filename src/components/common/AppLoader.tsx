"use client";

import React, { useEffect, useState } from "react";
import { Boxes, Sparkles, CheckCircle2 } from "lucide-react";

interface AppLoaderProps {
  onComplete?: () => void;
}

export function AppLoader({ onComplete }: AppLoaderProps) {
  const [progress, setProgress] = useState(12);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const phases = [
    "Initializing reactive state & local storage...",
    "Connecting multi-facility godown ledgers...",
    "Calibrating stock valuation & active catalog...",
    "Synchronizing audit trail & live alerts...",
    "Workspace ready",
  ];

  useEffect(() => {
    // Stage 1: Fast start
    const timer1 = setTimeout(() => {
      setProgress(42);
      setPhaseIndex(1);
    }, 180);

    // Stage 2: Mid sync
    const timer2 = setTimeout(() => {
      setProgress(76);
      setPhaseIndex(2);
    }, 420);

    // Stage 3: Almost done
    const timer3 = setTimeout(() => {
      setProgress(94);
      setPhaseIndex(3);
    }, 650);

    // Stage 4: 100% complete
    const timer4 = setTimeout(() => {
      setProgress(100);
      setPhaseIndex(4);
    }, 850);

    // Stage 5: Fade out and trigger onComplete
    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1050);

    const timer6 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F6F5] transition-opacity duration-300 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#228181]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#D78EAB]/15 blur-3xl pointer-events-none" />

      {/* Luxury Loader Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#EAE4E3] shadow-[0_12px_40px_-12px_rgba(34,129,129,0.12)] text-center animate-fade-in-scale">
        {/* Animated Brand Icon with dual rings */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#228181] to-[#D78EAB] opacity-20 blur-md animate-pulse" />
          
          {/* Rotating dashed ring */}
          <div className="absolute -inset-1.5 rounded-2xl border-2 border-dashed border-[#228181]/30 animate-[spin_10s_linear_infinite]" />

          {/* Core Logo Box */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#228181] to-[#175C5C] text-white flex items-center justify-center shadow-lg shadow-[#228181]/30">
            <Boxes className="w-8 h-8 text-white transition-transform duration-500 hover:rotate-12" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#D78EAB] text-white text-[11px] font-black flex items-center justify-center shadow-sm border-2 border-white">
              3
            </div>
          </div>
        </div>

        {/* Company & Product Title */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4F4] text-[#165353] border border-[#228181]/20 text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3 text-[#228181]" />
            <span>SasthaSoft Enterprise Suite</span>
          </div>
          <h2 className="text-xl font-black text-[#1C2727] tracking-tight">
            InventoCore Platform
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Multi-godown inventory, procurement &amp; GST billing engine
          </p>
        </div>

        {/* Smooth Linear Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="w-full h-2 rounded-full bg-[#FAF8F7] border border-[#EAE4E3] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#228181] via-[#31A3A3] to-[#D78EAB] transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-[#228181] truncate max-w-[280px]">
              {progress === 100 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#228181] shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#228181] animate-ping shrink-0 inline-block mr-1" />
              )}
              {phases[phaseIndex]}
            </span>
            <span className="font-mono font-bold text-[#1C2727] ml-2">
              {progress}%
            </span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-4 border-t border-[#EAE4E3]/70 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Connected ERP</span>
          <span>•</span>
          <span>Zero Latency</span>
          <span>•</span>
          <span>GST 18% Ready</span>
        </div>
      </div>
    </div>
  );
}
