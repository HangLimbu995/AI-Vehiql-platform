'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import PrefetchHomeClient from "../components/PrefetchHomeClient";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-500/20 blur-2xl animate-pulse" />
      </div>

      <main className="text-center max-w-xl flex flex-col items-center gap-6">
        {/* Preload / route */}
        <PrefetchHomeClient />

        {/* 404 numbers */}
        <div
          className="flex items-end justify-center gap-2 select-none"
          aria-hidden
        >
          <span
            className="text-[80px] sm:text-[120px] font-black leading-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md animate-bounce"
            style={{ animationDelay: "0ms" }}
          >
            4
          </span>
          <span
            className="text-[80px] sm:text-[120px] font-black leading-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md animate-bounce"
            style={{ animationDelay: "150ms" }}
          >
            0
          </span>
          <span
            className="text-[80px] sm:text-[120px] font-black leading-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md animate-bounce"
            style={{ animationDelay: "300ms" }}
          >
            4
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-foreground/70">
          The page you’re looking for doesn’t exist or has been moved. Check the
          URL, or return to the homepage.
        </p>

        {/* Fast Go Home Button */}
        <div className="mt-2">
          <div className="relative group rounded-full p-[4px] overflow-hidden shadow-[0_0_26px_rgba(99,102,241,0.30),0_0_36px_rgba(236,72,153,0.25)] dark:shadow-[0_0_28px_rgba(99,102,241,0.45),0_0_40px_rgba(236,72,153,0.35)]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(at_50%_50%,#22d3ee_0deg,#6366f1_90deg,#a855f7_180deg,#ec4899_270deg,#f59e0b_330deg,#22d3ee_360deg)] motion-safe:animate-[spin_6s_linear_infinite] motion-reduce:animate-none transform-gpu will-change-transform saturate-150 brightness-125 drop-shadow-[0_0_16px_rgba(124,58,237,0.55)]"></div>
            <div className="pointer-events-none absolute -inset-3 rounded-full bg-[conic-gradient(at_50%_50%,#22d3ee_0deg,#6366f1_90deg,#a855f7_180deg,#ec4899_270deg,#f59e0b_330deg,#22d3ee_360deg)] opacity-70 blur-[16px] motion-safe:animate-[spin_9s_linear_infinite_reverse] motion-reduce:animate-none transform-gpu will-change-transform"></div>
            <div className="pointer-events-none absolute inset-0 rounded-full bg-white/20 opacity-30"></div>

            <button
              onClick={() => router.replace("/")}
              aria-label="Go to homepage"
              title="Go to homepage"
              className="relative z-10 block rounded-full ring-1 ring-black/5 dark:ring-white/10 transition-colors flex items-center justify-center bg-background/95 backdrop-blur-[2px] text-foreground hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm sm:text-base h-10 sm:h-12 px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
            >
              Go Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
