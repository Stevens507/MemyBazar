import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}

// Funciones para manejar sesiones completas de usuario (nombre + teléfono)
export type UserSession = {
  name: string
  phone: string
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const name = cookieStore.get('user_name')?.value || null
  const phone = cookieStore.get('user_phone')?.value || null

  if (name && phone) {
    return { name, phone }
  }
  return null
}

export async function setUserSession(name: string, phone: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('user_name', name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  })
  cookieStore.set('user_phone', phone, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  })
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('user_name', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expira inmediatamente
  })
  cookieStore.set('user_phone', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expira inmediatamente
  })
}

// Funciones legacy para compatibilidad (mantener por si acaso)
export async function getUserPhone(): Promise<string | null> {
  const session = await getUserSession()
  return session?.phone || null
}

export async function setUserPhone(phone: string): Promise<void> {
  // Esta función necesita un nombre, usar función completa
  console.warn('setUserPhone() necesita un nombre, usa setUserSession() en su lugar')
}

export async function clearUserPhone(): Promise<void> {
  await clearUserSession()
}
