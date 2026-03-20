"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, User, Menu, Map, Home, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Header() {
  const [location] = useState("British Columbia")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Image
            src="/images/logo-icon.png"
            alt="FarmStand"
            width={36}
            height={36}
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
          />
          <div className="hidden sm:block leading-tight">
            <span className="text-base font-bold text-[#2d6a4f]">FarmStand</span>
            <span className="block text-[10px] font-semibold text-[#e67e22] tracking-[0.15em] uppercase -mt-0.5">Connect</span>
          </div>
        </Link>

        {/* Search - visible on all sizes */}
        <div className="flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search farms..."
              className="w-full pl-8 sm:pl-10 pr-3 h-9 sm:h-10 text-sm bg-input border-border focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Location - desktop only */}
        <Button variant="ghost" className="hidden gap-2 text-foreground lg:flex shrink-0">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{location}</span>
        </Button>

        {/* Mobile: hamburger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/map" className="flex items-center gap-2">
                <Map className="h-4 w-4" /> Map View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/farms" className="flex items-center gap-2">
                <Store className="h-4 w-4" /> Browse Farms
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop: user icon */}
        <Button variant="ghost" size="icon" className="hidden md:flex shrink-0">
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t border-border bg-card md:block">
        <div className="container flex items-center gap-6 px-4 py-2">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-primary">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Map View
          </Link>
          <Link href="/farms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Farms
          </Link>
        </div>
      </nav>
    </header>
  )
}
