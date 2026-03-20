import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <Image
                src="/images/logo-icon.png"
                alt="FarmStand Connect"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <div className="leading-tight">
                <span className="text-sm font-bold text-[#2d6a4f]">FarmStand</span>
                <span className="block text-[9px] font-semibold text-[#e67e22] tracking-[0.12em] uppercase -mt-0.5">Connect</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Connecting communities with local farmers for fresh, sustainable produce.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/farms" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">Browse Farms</Link></li>
              <li><Link href="/map" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">Map View</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">For Farmers</h4>
            <ul className="space-y-2">
              <li><Link href="/sell" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">List Your Farm</Link></li>
              <li><Link href="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FarmStand Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
