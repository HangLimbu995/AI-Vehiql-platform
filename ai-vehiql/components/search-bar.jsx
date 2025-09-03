"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Search, Zap } from "lucide-react";

export default function SearchBar({ className }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/cars?${params.toString()}`);
  };

  const suggestAI = () => {
    const suggestion = "electric SUV under 50k";
    setQ(suggestion);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-3xl mx-auto flex items-center gap-2 bg-white/90 dark:bg-slate-900/80 rounded-full shadow-sm px-3 py-2 ${className}`}
      role="search"
      aria-label="Search cars"
      data-ai="home-search"
    >
      <label htmlFor="site-search" className="sr-only">
        Search vehicles, e.g. &quot;Toyota SUV&quot;
      </label>
      <Search className="h-5 w-5 text-slate-500" aria-hidden="true" />
      <input
        id="site-search"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by make, model, year, price, features..."
        className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
        aria-label="Search vehicles"
        data-input="search-query"
      />
      <button
        type="button"
        onClick={suggestAI}
        aria-label="Get AI search suggestion"
        title="Try AI suggestion"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        data-action="ai-suggest"
      >
        <Zap className="h-4 w-4" />
        Try AI
      </button>
      <Button type="submit" className="rounded-full px-4 py-2" asChild>
        <button aria-label="Search">Search</button>
      </Button>
    </form>
  );
}


