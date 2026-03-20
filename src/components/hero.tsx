"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden h-[220px] sm:h-[280px] md:h-[340px]">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/images/hero-bg-hq.webp" type="image/webp" />
          <Image
            src="/images/hero-bg-hq.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 sm:from-white/90 sm:via-white/70 sm:to-transparent" />
      </div>

      <div className="container relative px-4 py-6 sm:py-10 md:py-14 h-full flex items-center">
        <div className="max-w-lg space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
            <span className="text-[#2d6a4f]">FarmStand</span>{" "}
            <span className="block text-[#e67e22] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.15em] uppercase mt-0.5 sm:mt-1">Connect</span>
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Discover fresh produce, eggs, meats, and more from local farms nearby.
          </p>
          <Link href="/farms">
            <Button size="default" className="sm:!h-11 sm:!px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 rounded-full">
              Browse Farms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
