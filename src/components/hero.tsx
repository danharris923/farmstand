"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      </div>

      <div className="container relative px-4 py-16 md:py-24">
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Shop Fresh{" "}
            <span className="text-primary">&</span>{" "}
            Local
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Discover fresh produce, eggs, meats, and more from local farms nearby.
          </p>
          <Link href="/farms">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 rounded-full">
              Browse Farms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
