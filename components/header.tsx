"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [session, setSession] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    loadSession()

    const handleSessionUpdate = () => {
      loadSession()
    }

    window.addEventListener("memy-session-updated", handleSessionUpdate)
    return () => window.removeEventListener("memy-session-updated", handleSessionUpdate)
  }, [])

  const loadSession = async () => {
    try {
      const response = await fetch('/api/session/phone')
      if (response.ok) {
        const data = await response.json()
        if (data.session) {
          setSession(data.session)
        }
      }
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const clearSession = async () => {
    try {
      await fetch('/api/session/phone', { method: 'DELETE' })
      setSession(null)
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }

  return (
    <header className="border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/MemyCollection.png"
              alt="MemyCollection Logo"
              width={96}
              height={96}
              quality={100}
              priority
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">MemyCollection</span>
              <p className="text-xl font-semibold text-black">Bazar Boutique</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {session && (
              <>
                {/* Indicador móvil */}
                <div className="md:hidden">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium rounded-full bg-rose-500 px-2.5 py-1 text-white shadow-sm"
                  >
                    Sesión activa
                  </Badge>
                </div>

                {/* Indicador desktop */}
                <div className="hidden md:flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 shadow-sm">
                  <User className="h-4 w-4 text-black/70" />
                  <div className="text-sm">
                    <p className="font-semibold text-black">{session.name}</p>
                    <p className="text-black/60">{session.phone}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold rounded-full bg-rose-500 px-3 py-1 text-white shadow-sm"
                  >
                    Activo
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSession}
                    className="h-8 w-8 p-0 rounded-full border border-black/5 text-black/70 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}

            <div className="hidden md:flex items-center gap-2">
              <Link href="/#catalogo">
                <Button variant="ghost" className="text-black/70 hover:text-black">
                  Ver catálogo
                </Button>
              </Link>
              <Link href="/experience">
                <Button variant="ghost" className="text-black/70 hover:text-black">
                  Cómo funciona
                </Button>
              </Link>
            </div>
            <Link href="/experience" className="md:hidden">
              <Button variant="ghost" size="sm" className="text-black/70 hover:text-black">
                Cómo funciona
              </Button>
            </Link>
            <Link href="/reservations">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Mis Reservas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
