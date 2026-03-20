"use client";

import { cn } from "@/lib/utils";
import {
  Apple,
  Beef,
  Fish,
  Egg,
  CakeSlice,
  Flower2,
  Wine,
  Cookie,
  Truck,
  Droplets,
  Palette,
} from "lucide-react";

const PRODUCTS = [
  { name: "Fruits / Vegetables", icon: Apple, color: "text-green-600 bg-green-50" },
  { name: "Meat", icon: Beef, color: "text-red-600 bg-red-50" },
  { name: "Seafood", icon: Fish, color: "text-blue-600 bg-blue-50" },
  { name: "Dairy", icon: Egg, color: "text-yellow-600 bg-yellow-50" },
  { name: "Baking", icon: CakeSlice, color: "text-amber-600 bg-amber-50" },
  { name: "Honey", icon: Droplets, color: "text-orange-600 bg-orange-50" },
  { name: "Plants", icon: Flower2, color: "text-emerald-600 bg-emerald-50" },
  { name: "Preserves + Prepared Foods", icon: Cookie, color: "text-purple-600 bg-purple-50" },
  { name: "Alcohol - Beer, Wine, Cider, Liquor", icon: Wine, color: "text-rose-600 bg-rose-50" },
  { name: "Food Trucks + Beverage", icon: Truck, color: "text-sky-600 bg-sky-50" },
  { name: "Artisans / Crafters", icon: Palette, color: "text-indigo-600 bg-indigo-50" },
];

export function ProductFilter({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (product: string | null) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {PRODUCTS.map((p) => {
        const Icon = p.icon;
        const isSelected = selected === p.name;
        // Short display name
        const shortName = p.name.split(" / ")[0].split(" - ")[0].split(" + ")[0];

        return (
          <button
            key={p.name}
            onClick={() => onSelect(isSelected ? null : p.name)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : `${p.color} hover:shadow-sm`
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {shortName}
          </button>
        );
      })}
    </div>
  );
}
