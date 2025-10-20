"use client"

import { useState, useMemo } from "react"
import { ClothingCard } from "@/components/clothing-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

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

export function CatalogClient({ initialItems }: { initialItems: ClothingItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")

  const categories = useMemo(() => {
    const cats = new Set(initialItems.map((item) => item.category))
    return ["all", ...Array.from(cats)]
  }, [initialItems])

  const sizes = useMemo(() => {
    const szs = new Set(initialItems.map((item) => item.size))
    return ["all", ...Array.from(szs)]
  }, [initialItems])

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesSize = sizeFilter === "all" || item.size === sizeFilter

      return matchesSearch && matchesCategory && matchesSize
    })
  }, [initialItems, searchTerm, categoryFilter, sizeFilter])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground text-balance">Explora Nuestra Colección</h2>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar prendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "Todas las categorías" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Talla" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size === "all" ? "Todas las tallas" : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredItems.length} {filteredItems.length === 1 ? "prenda encontrada" : "prendas encontradas"}
      </p>

      {/* Catalog grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No se encontraron prendas con los filtros seleccionados</p>
        </div>
      )}
    </div>
  )
}
