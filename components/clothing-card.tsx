"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReservationDialog } from "@/components/reservation-dialog"

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

type ClothingCardProps = {
  item: ClothingItem
}

export function ClothingCard({ item }: ClothingCardProps) {
  const isAvailable = item.available
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[3/4] overflow-hidden bg-black/5">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between text-xs">
            <Badge className="rounded-full bg-black/80 px-3 py-1 text-white shadow-sm">
              {item.category}
            </Badge>
            {!isAvailable && (
              <Badge className="rounded-full bg-rose-600 px-3 py-1 text-white shadow-sm">Reservado</Badge>
            )}
          </div>
          {!isAvailable && (
            <>
              <div className="absolute inset-0 bg-white/35" />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-lg ring-1 ring-black/10">
                  <span className="text-black">Reservado</span>
                  <span className="text-rose-500">Exclusivo Memy</span>
                </div>
              </div>
            </>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-black text-balance">{item.name}</h3>
            <p className="text-sm text-black/60 line-clamp-2">{item.description}</p>
          </div>
          <div className="mt-auto flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3">
            <span className="text-2xl font-semibold text-rose-600">
              ${item.price.toFixed(2)}
            </span>
            <Badge variant="outline" className="border-black/10 bg-white/80 text-black/70">
              Talla {item.size}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="px-5 pb-5 pt-0">
          {isAvailable ? (
            <Button
              className="w-full rounded-full bg-rose-500 text-white shadow-sm hover:bg-rose-600 hover:shadow-md"
              onClick={() => setShowDialog(true)}
            >
              Tomar ahora
            </Button>
          ) : (
            <Button
              className="w-full rounded-full bg-black/10 text-black/50 shadow-none"
              disabled
            >
              Reservado
            </Button>
          )}
        </CardFooter>
      </Card>

      <ReservationDialog item={item} open={showDialog} onOpenChange={setShowDialog} />
    </>
  )
}
