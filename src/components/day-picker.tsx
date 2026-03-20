"use client";

import { cn } from "@/lib/utils";

const DAYS = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

export function DayPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (day: string) => void;
}) {
  const today = DAYS[new Date().getDay()].full;

  return (
    <div className="flex gap-1.5">
      {DAYS.map((day) => (
        <button
          key={day.full}
          onClick={() => onSelect(selected === day.full ? "" : day.full)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
            selected === day.full
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            day.full === today && selected !== day.full && "ring-1 ring-primary/30"
          )}
        >
          {day.short}
          {day.full === today && (
            <span className="ml-1 text-[10px] opacity-70">today</span>
          )}
        </button>
      ))}
    </div>
  );
}
