import { NextRequest, NextResponse } from 'next/server'
import { getUserSession, setUserSession, clearUserSession } from '@/lib/server'

export async function GET() {
  try {
    const session = await getUserSession()
    // Si no hay sesión, devolver una sesión de ejemplo para visualización
    const defaultSession = session || {
      name: "María González",
      phone: "+507 6000 0000"
    }
    return NextResponse.json({ session: defaultSession })
  } catch (error) {
    console.error('Error getting user session:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone } = body

    if (!name || typeof name !== 'string' || !phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Nombre y teléfono son requeridos' }, { status: 400 })
    }

    await setUserSession(name, phone)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting user session:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await clearUserSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing user session:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
