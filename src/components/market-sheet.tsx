"use client";

import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Mail,
  Instagram,
  Facebook,
  X,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MarketWithDetails } from "@/lib/types";

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

const seasonColors: Record<string, string> = {
  summer: "bg-green-100 text-green-700",
  winter: "bg-blue-100 text-blue-700",
  "year-round": "bg-purple-100 text-purple-700",
};

export function MarketSheet({
  market,
  selectedDay,
  onClose,
}: {
  market: MarketWithDetails;
  selectedDay: string;
  onClose: () => void;
}) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:absolute md:right-4 md:bottom-4 md:left-auto md:w-[380px]">
      <div className="bg-card border border-border rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
        {/* Header with image */}
        {market.image_url && (
          <div className="relative h-40 overflow-hidden rounded-t-2xl md:rounded-t-2xl">
            <img
              src={market.image_url}
              alt={market.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4">
          {/* Title & badges */}
          {!market.image_url && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-start gap-2 mb-2">
            <h2 className="text-lg font-bold text-foreground flex-1">
              {market.name}
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {market.season_type && (
              <Badge
                className={cn(
                  "text-xs",
                  seasonColors[market.season_type] || ""
                )}
              >
                {market.season_type}
              </Badge>
            )}
            {market.region && (
              <Badge variant="outline" className="text-xs">
                {market.region}
              </Badge>
            )}
          </div>

          {/* Season dates */}
          {market.season_start && (
            <p className="text-xs text-muted-foreground mb-3">
              Season: {market.season_start} – {market.season_end}
            </p>
          )}

          {/* Hours */}
          {market.hours && market.hours.length > 0 && (
            <>
              <div className="space-y-1 mb-3">
                {market.hours.map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 text-sm px-2 py-1 rounded",
                      h.day_of_week === selectedDay
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="w-20">{h.day_of_week}</span>
                    <span>
                      {formatTime(h.open_time)} – {formatTime(h.close_time)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
            </>
          )}

          {/* Address & directions */}
          {market.address && (
            <div className="flex items-start gap-2 mb-2 text-sm">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
              <span>
                {market.address}, {market.city}, {market.province}{" "}
                {market.postal_code}
              </span>
            </div>
          )}

          <Button
            size="sm"
            className="w-full mb-3 gap-1.5 rounded-full"
            asChild
          >
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          </Button>

          {/* Products */}
          {market.products && market.products.length > 0 && (
            <>
              <Separator className="my-3" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                What you'll find
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {market.products.map((p) => (
                  <Badge key={p.product} variant="secondary" className="text-xs">
                    {p.product}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Contact */}
          <Separator className="my-3" />
          <div className="space-y-2">
            {market.phone && (
              <a
                href={`tel:${market.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <Phone className="w-4 h-4" />
                {market.phone}
              </a>
            )}
            {market.email && (
              <a
                href={`mailto:${market.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <Mail className="w-4 h-4" />
                {market.email}
              </a>
            )}
            {market.website && (
              <a
                href={market.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <Globe className="w-4 h-4" />
                Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {(market.instagram || market.facebook) && (
              <div className="flex gap-3 pt-1">
                {market.instagram && (
                  <a
                    href={market.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {market.facebook && (
                  <a
                    href={market.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {market.description && (
            <>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground line-clamp-4">
                {market.description}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
