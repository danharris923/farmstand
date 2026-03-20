import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
      <div className="container px-4 py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Shop Fresh{" "}
              <span className="text-primary">&</span>{" "}
              Local
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Discover fresh produce, eggs, meats, and more from local farms nearby.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 rounded-full">
              Browse Farms
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80"
                alt="Fresh farm produce in a wicker basket"
                fill
                className="object-cover"
                priority
              />
              {/* Decorative farm illustration overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Floating decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </section>
  )
}
