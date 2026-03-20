"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Locate } from "lucide-react";
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
    <header className="border-b border-border bg-card px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Image
          src="/images/logo-icon.png"
          alt="FarmStand"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <div>
          <h1 className="text-sm sm:text-lg font-bold text-foreground leading-tight">
            Map View
          </h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {loading ? "Loading..." : `${marketCount} farms & markets`}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onLocateMe}
        className="gap-1.5 rounded-full shrink-0"
      >
        <Locate className="w-4 h-4" />
        <span className="hidden sm:inline">Near Me</span>
      </Button>
    </header>
  );
}
