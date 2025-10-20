"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ReservationsList } from "@/components/reservations-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserReservations } from "@/app/actions/reservations"

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

export default function ReservationsPage() {
  const [phone, setPhone] = useState("")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [savedSession, setSavedSession] = useState<{ name: string; phone: string } | null>(null)
  const [showManualSearch, setShowManualSearch] = useState(false)

  // Cargar sesión guardada al montar el componente
  useEffect(() => {
    loadSavedSession()
  }, [])

  const loadSavedSession = async () => {
    try {
      const response = await fetch('/api/session/phone')
      if (response.ok) {
        const data = await response.json()
        if (data.session) {
          setSavedSession(data.session)
          // Cargar automáticamente las reservas del usuario
          await loadReservations(data.session.phone)
        }
      }
    } catch (error) {
      console.error('Error loading saved session:', error)
    }
  }

  const loadReservations = async (userPhone: string) => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const result = await getUserReservations(userPhone)
      if (result.error) {
        setError(result.error)
        setReservations([])
      } else {
        // Filtrar reservas que tienen clothing_items válidos
        const validReservations = (result.reservations || []).filter(r => r.clothing_items !== null) as Reservation[]
        setReservations(validReservations)
      }
    } catch (err) {
      setError("Ocurrió un error al buscar las reservas.")
      setReservations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await loadReservations(phone)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/session/phone', { method: 'DELETE' })
      setSavedSession(null)
      setReservations([])
      setHasSearched(false)
      setShowManualSearch(false)
      setPhone("")
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-balance mb-2">
              Mis <span className="text-primary">Reservas</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Consulta tus prendas apartadas, verifica el total y confirma tu método de pago.
            </p>
          </div>

          {!savedSession || showManualSearch ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Buscar Reservas</CardTitle>
                <CardDescription>
                  Ingresa tu número de teléfono para ver tus reservas activas.
                  <span className="block mt-1 text-sm text-muted-foreground">
                    Tu información se guarda automáticamente después de hacer tu primera reserva.
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="phone" className="sr-only">
                      Número de Teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+507 6000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                    {isLoading ? "Buscando..." : "Buscar"}
                  </Button>
                </form>
                {savedSession && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setShowManualSearch(false)
                      loadReservations(savedSession.phone)
                    }}
                    className="mt-2"
                  >
                    Volver a mi cuenta ({savedSession.name})
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : null}

          {error && <div className="rounded-lg bg-destructive/10 p-4 text-destructive mb-6">{error}</div>}

          {!isLoading && (savedSession || hasSearched) && (
            <ReservationsList reservations={reservations} onUpdate={() => loadReservations(savedSession?.phone || phone)} />
          )}
        </div>
      </main>
    </div>
  )
}
