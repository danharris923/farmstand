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
  const [location] = useState("Grimsby, ON")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="FarmStand Connect"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Search Bar - Hidden on mobile */}
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
        <Button variant="ghost" className="hidden gap-2 text-foreground md:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{location}</span>
        </Button>

        {/* User Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              2
            </span>
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
              <DropdownMenuItem>Home</DropdownMenuItem>
              <DropdownMenuItem>New For You</DropdownMenuItem>
              <DropdownMenuItem>Browse Farms</DropdownMenuItem>
              <DropdownMenuItem>Your Orders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation - Hidden on mobile */}
      <nav className="hidden border-t border-border bg-card md:block">
        <div className="container flex items-center gap-6 px-4 py-2">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-primary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
          <Link href="/new" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            New For You
          </Link>
          <Link href="/farms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Farms
          </Link>
          <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Your Orders
          </Link>
        </div>
      </nav>
    </header>
  )
}
