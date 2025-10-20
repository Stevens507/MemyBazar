"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { createReservation } from "@/app/actions/reservations"

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

type ReservationDialogProps = {
  item: ClothingItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationDialog({ item, open, onOpenChange }: ReservationDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"yappy" | "efectivo">("yappy")
  const [savedSession, setSavedSession] = useState<{ name: string; phone: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Cargar sesión guardada cuando se abra el diálogo
  useEffect(() => {
    if (open) {
      loadSavedSession()
    } else {
      // Limpiar estado cuando se cierre el diálogo
      if (!savedSession) {
        setName("")
        setPhone("")
      }
      setPaymentMethod("yappy")
      setSavedSession(null)
      setError(null)
      setSuccess(false)
    }
  }, [open, savedSession])

  const loadSavedSession = async () => {
    try {
      const response = await fetch('/api/session/phone')
      if (response.ok) {
        const data = await response.json()
        if (data.session) {
          setSavedSession(data.session)
          setName(data.session.name)
          setPhone(data.session.phone)
        }
      }
    } catch (error) {
      console.error('Error loading saved session:', error)
    }
  }

  const saveSessionToStorage = async (userName: string, phoneNumber: string) => {
    try {
      await fetch('/api/session/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName, phone: phoneNumber }),
      })
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Usar datos de sesión si existe, sino usar formulario
      const userName = savedSession ? savedSession.name : name
      const userPhone = savedSession ? savedSession.phone : phone

      const result = await createReservation({
        itemId: item.id,
        userName,
        userPhone,
        paymentMethod,
      })

      if (result.error) {
        setError(result.error)
      } else {
        // Guardar sesión completa solo si viene del formulario (nueva sesión)
        if (!savedSession) {
          await saveSessionToStorage(name, phone)
        }

        setSuccess(true)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("memy-session-updated"))
        }
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
          if (!savedSession) {
            setName("")
            setPhone("")
            setPaymentMethod("yappy")
          }
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError("Ocurrió un error al procesar tu reserva. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl border border-black/5 bg-white/95 backdrop-blur">
        {success ? (
          <div className="space-y-5 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-rose-500/10 text-rose-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-black">Reserva confirmada</h3>
            <div className="mx-auto max-w-md space-y-4 text-sm text-black/65">
              <p>Tu pieza quedó apartada. Tienes 8 a 10 días naturales para completar el pago.</p>
              <div className="rounded-2xl border border-black/5 bg-black/5 px-4 py-3 text-left">
                <p className="font-medium text-black">Método elegido</p>
                <p className="mt-1 text-sm text-black/65">
                  {paymentMethod === "yappy"
                    ? "Yappy — envía tu comprobante para confirmar la reserva."
                    : "Efectivo al retirar en nuestro local Pago Studio (Santiago, Veraguas)."}
                </p>
              </div>
              <p>
                Coordina tu entrega o retiro escribiéndonos por WhatsApp o desde{" "}
                <Link href="/experience" className="text-rose-600 underline underline-offset-4 hover:text-rose-800">
                  la sección “Cómo funciona”.
                </Link>
              </p>
            </div>
          </div>
        ) : savedSession ? (
          // MODO ULTRA-RÁPIDO: Solo para sesiones activas
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-black">Confirmar reserva</DialogTitle>
              <DialogDescription className="text-sm text-black/60">
                {savedSession.name}, estás reservando <span className="font-semibold text-black">{item.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="mb-4 rounded-2xl border border-black/5 bg-black/5 px-5 py-4">
                <div className="flex justify-between text-sm text-black/60">
                  <span>Cliente</span>
                  <span className="font-medium text-black">{savedSession.name}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Teléfono</span>
                  <span className="font-medium text-black">{savedSession.phone}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Prenda</span>
                  <span className="font-medium text-black">{item.name}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Talla</span>
                  <span className="font-medium text-black">{item.size}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                    <span>Precio</span>
                    <span className="font-semibold text-rose-600">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Método</span>
                  <span className="font-medium text-black">
                    {paymentMethod === "yappy" ? "Yappy" : "Efectivo en local"}
                  </span>
                </div>
              </div>

              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("yappy")}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === "yappy"
                      ? "border-rose-200 bg-rose-500/10 text-rose-600"
                      : "border-black/10 bg-white text-black/70 hover:border-rose-200/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image src="/yappy.webp" alt="Yappy" width={40} height={40} className="h-9 w-9 object-contain" />
                    <div>
                      <span className="block text-sm font-semibold">Yappy</span>
                      <span className="text-xs text-black/50">Paga al instante y envía comprobante.</span>
                    </div>
                  </div>
                </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("efectivo")}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        paymentMethod === "efectivo"
                          ? "border-rose-200 bg-rose-500/10 text-rose-600"
                      : "border-black/10 bg-white text-black/70 hover:border-rose-200/70"
                  }`}
                >
                  <span className="block text-sm font-semibold">Efectivo en local</span>
                  <span className="text-xs text-black/50">Pago al retirar en Pago Studio, Santiago.</span>
                </button>
              </div>

              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
                Dispones de 8 a 10 días para confirmar el pago por tu método elegido. Si cambiaste de opción, ajusta la
                selección antes de confirmar.
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={isLoading}
                className="flex-1 rounded-full bg-rose-500 text-white hover:bg-rose-600"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar reserva"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // MODO FORMULARIO: Para nuevas sesiones
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-black">Reservar prenda</DialogTitle>
              <DialogDescription className="text-sm text-black/60">
                Ingresa tus datos para apartar <span className="font-semibold text-black">{item.name}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-black">Método de pago</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("yappy")}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        paymentMethod === "yappy"
                          ? "border-rose-200 bg-rose-500/10 text-rose-600"
                          : "border-black/10 bg-white text-black/70 hover:border-rose-200/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Image src="/yappy.webp" alt="Yappy" width={40} height={40} className="h-9 w-9 object-contain" />
                        <div>
                          <span className="block text-sm font-semibold">Yappy</span>
                          <span className="text-xs text-black/50">Envíanos tu comprobante para proteger la reserva.</span>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("efectivo")}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        paymentMethod === "efectivo"
                          ? "border-rose-200 bg-rose-500/10 text-rose-600"
                          : "border-black/10 bg-white text-black/70 hover:border-rose-200/70"
                      }`}
                    >
                      <span className="block text-sm font-semibold">Efectivo en local</span>
                      <span className="text-xs text-black/50">Retiro en Pago Studio, Santiago (Veraguas).</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-black/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-black/50">
                  Guardamos tus datos para futuras reservas rápidas.
                </div>

                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Prenda</span>
                    <span className="font-medium text-black">{item.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Talla</span>
                    <span className="font-medium text-black">{item.size}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Precio</span>
                    <span className="font-semibold text-rose-600">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
                  Recuerda completar el pago en máximo 10 días y coordinar entrega en Pago Studio (Santiago, Veraguas).
                  Aceptamos Yappy o efectivo al retiro.
                </div>
                {error && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Procesando...
                    </>
                  ) : (
                    "Reservar y guardar datos"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
