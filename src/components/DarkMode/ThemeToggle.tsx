"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3 ps-4">
      {/* Label */}
      <span className="text-sm font-medium text-foreground">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>

      {/* Switch */}
      <div
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          isDark ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md transform transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
}
