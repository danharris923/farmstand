"use client";

import { MapPin, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({
  onLocateMe,
  marketCount,
  loading,
}: {
  onLocateMe: () => void;
  marketCount: number;
  loading: boolean;
}) {
  return (
    <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            FarmStand
          </h1>
          <p className="text-xs text-muted-foreground">
            {loading ? "Loading..." : `${marketCount} BC Farmers Markets`}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onLocateMe}
        className="gap-1.5 rounded-full"
      >
        <Locate className="w-4 h-4" />
        <span className="hidden sm:inline">Near Me</span>
      </Button>
    </header>
  );
}
