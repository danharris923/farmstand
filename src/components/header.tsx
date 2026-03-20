"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, ShoppingCart, User, Menu } from "lucide-react"
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
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo - icon + text */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo-icon.png"
            alt="FarmStand"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div className="hidden sm:block leading-tight">
            <span className="text-base font-bold text-[#2d6a4f]">FarmStand</span>
            <span className="block text-[10px] font-semibold text-[#e67e22] tracking-[0.15em] uppercase -mt-0.5">Connect</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 md:flex max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for fresh produce, eggs, meats, etc..."
              className="w-full pl-10 pr-4 bg-input border-border focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Location */}
        <Button variant="ghost" className="hidden gap-2 text-foreground lg:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{location}</span>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <MapPin className="mr-2 h-4 w-4" />
                {location}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/map">Map View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/farms">Browse Farms</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="hidden border-t border-border bg-card md:block">
        <div className="container flex items-center gap-6 px-4 py-2">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-primary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
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
