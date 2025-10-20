"use client"

import { useState } from "react"
import { ClothingCard } from "@/components/clothing-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ClothingItem = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  size: string
  available: boolean
}

type CatalogGridProps = {
  items: ClothingItem[]
}

export function CatalogGrid({ items }: CatalogGridProps) {
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">Catálogo</p>
          <p className="text-base text-black">
            {filteredItems.length} {filteredItems.length === 1 ? "prenda disponible" : "prendas disponibles"}
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[220px] border-black/10 bg-white text-black hover:border-black/20 focus:ring-rose-300 focus:ring-offset-0">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent className="border border-black/5 bg-white shadow-lg">
            <SelectItem value="all" className="text-black">
              Todas las categorías
            </SelectItem>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="capitalize text-black/70 focus:bg-rose-50 focus:text-rose-600"
                >
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No hay prendas disponibles en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
