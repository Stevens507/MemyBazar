"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Package } from "lucide-react"
// import { cancelReservation } from "@/app/actions/reservations"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Reservation = {
  id: string
  item_id: string
  user_phone: string
  user_name: string
  reserved_at: string
  expires_at?: string
  status: string
  payment_method?: "yappy" | "efectivo"
  clothing_items: {
    id: string
    name: string
    description: string
    price: number
    image_url: string
    category: string
    size: string
  }
}

type ReservationsListProps = {
  reservations: Reservation[]
  onUpdate: () => void
}

export function ReservationsList({ reservations, onUpdate }: ReservationsListProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null)

  // Función de cancelar reserva comentada para desarrollo con datos mock
  // const handleCancelClick = (reservationId: string) => {
  //   setSelectedReservation(reservationId)
  //   setShowCancelDialog(true)
  // }

  // const handleCancelConfirm = async () => {
  //   if (!selectedReservation) return

  //   setCancellingId(selectedReservation)
  //   try {
  //     const result = await cancelReservation(selectedReservation)
  //     if (result.success) {
  //       onUpdate()
  //     }
  //   } finally {
  //     setCancellingId(null)
  //     setShowCancelDialog(false)
  //     setSelectedReservation(null)
  //   }
  // }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = (reservation: Reservation) => {
    const now = new Date()
    const expires = reservation.expires_at
      ? new Date(reservation.expires_at)
      : new Date(new Date(reservation.reserved_at).getTime() + 10 * 24 * 60 * 60 * 1000)
    const diff = expires.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return hours > 0 ? `${hours}h restantes` : "Expira pronto"
  }

  const totals = reservations.reduce(
    (acc, reservation) => {
      const price = reservation.clothing_items?.price ?? 0
      acc.amount += price
      const method = reservation.payment_method ?? "yappy"
      acc.methods[method] = (acc.methods[method] ?? 0) + 1
      return acc
    },
    { amount: 0, methods: {} as Record<string, number> }
  )

  const methodSummary =
    reservations.length === 0
      ? []
      : [
          { key: "yappy", label: "Yappy" },
          { key: "efectivo", label: "Efectivo" },
        ].filter(({ key }) => totals.methods[key])

  if (reservations.length === 0) {
    return (
      <Card className="border border-black/5">
        <CardContent className="py-12 text-center space-y-4">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-black">No tienes reservas activas</h3>
            <p className="text-sm text-muted-foreground">
              Explora el catálogo y aparta tus próximas piezas favoritas.
            </p>
          </div>
          <Button variant="ghost" className="rounded-full border border-black/10" asChild>
            <Link href="/#catalogo">Ir al catálogo</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-6 border border-black/5">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">Resumen</p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              {reservations.length} {reservations.length === 1 ? "prenda reservada" : "prendas reservadas"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.25em] text-black/40">Total estimado</p>
              <p className="text-3xl font-semibold text-rose-600">
                ${totals.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.25em] text-black/50">
              {methodSummary.map(({ key, label }) => (
                <span key={key}>
                  {label} · {totals.methods[key]}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-64 md:h-auto bg-muted">
                <Image
                  src={reservation.clothing_items.image_url || "/placeholder.svg"}
                  alt={reservation.clothing_items.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{reservation.clothing_items.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{reservation.clothing_items.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Talla {reservation.clothing_items.size}</Badge>
                        <Badge className="bg-primary">{reservation.clothing_items.category}</Badge>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      ${reservation.clothing_items.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Reservado: {formatDate(reservation.reserved_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeRemaining(reservation)}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="font-medium text-black">Contacto</p>
                      <p className="text-muted-foreground">
                        {reservation.user_name} · {reservation.user_phone}
                      </p>
                    </div>
                    <div className="rounded-lg bg-black/5 p-3">
                      <p className="font-medium text-black">Método de pago</p>
                      <p className="text-muted-foreground">
                        {reservation.payment_method === "efectivo" ? "Efectivo en local" : "Yappy"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  {/* Botón de cancelar comentado para desarrollo con datos mock */}
                  {/* <Button
                    variant="destructive"
                    onClick={() => handleCancelClick(reservation.id)}
                    disabled={cancellingId === reservation.id}
                  >
                    {cancellingId === reservation.id ? "Cancelando..." : "Cancelar Reserva"}
                  </Button> */}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AlertDialog comentado para desarrollo con datos mock */}
      {/*
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción liberará la prenda y estará disponible para otros usuarios. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener reserva</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} className="bg-destructive hover:bg-destructive/90">
              Sí, cancelar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      */}
    </>
  )
}
