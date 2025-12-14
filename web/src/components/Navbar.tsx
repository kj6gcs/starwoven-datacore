"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spin as Hamburger } from "hamburger-react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const wikiPages = [
    ["/characters", "Characters"],
    ["/factions", "Factions"],
    ["/ships", "Ships"],
    ["/locations", "Locations"],
    ["/episodes", "Episodes"],
    ["/technology", "Technology"],
    ["/lore", "Lore"],
    // ["/timeline", "Timeline"],
  ] as const;

  return (
    <nav className="bg-gradient-to-b from-stone-900 to-stone-800 border-t border-b-2 border-amber-400 text-amber-400 pl-4 pt-2 pb-2 pr-4 flex justify-between items-center shadow-xl shadow-amber-400/50 relative z-50">
      <div className="flex items-center space-x-4 w-full">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-amber-400 whitespace-nowrap"
        >
          Starwoven Data Core
        </Link>

        {/* Desktop search */}
        <form onSubmit={submitSearch} className="hidden sm:block">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the Datacore..."
            className="px-2 py-1 rounded bg-stone-800 text-white border border-stone-700 focus:outline-none focus:ring-amber-400 w-64"
          />
        </form>
      </div>

      <Hamburger
        toggled={menuOpen}
        toggle={setMenuOpen}
        color="#fbbf24"
        size={32}
        rounded
        duration={0.4}
      />

      {menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-16 right-4 bg-gradient-to-b from-stone-900 to-stone-800 rounded-lg shadow-xl p-4 space-y-2 w-64 border-2 border-amber-400 z-50 animate-fade-in"
        >
          {/* Mobile search */}
          <form onSubmit={submitSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Datacore..."
              className="w-full px-2 py-1 rounded bg-stone-800 text-white border border-stone-700 focus:outline-none focus:ring-amber-400"
            />
          </form>

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-2 py-1 rounded bg-stone-800 shadow hover:scale-105 transition"
          >
            Home
          </Link>

          {wikiPages.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-1 rounded bg-stone-800 shadow hover:scale-105 transition"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
