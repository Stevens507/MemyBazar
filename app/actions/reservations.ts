"use server"

// Datos mock para desarrollo (simulando base de datos)
const mockItems = [
  {
    id: "1",
    name: "Blusa Elegante Rosa",
    description: "Hermosa blusa de encaje con mangas 3/4, perfecta para ocasiones especiales. Diseño floral delicado con acabado de alta calidad.",
    price: 89.99,
    image_url: "/ropa1.png",
    category: "Blusas",
    size: "M",
    available: true,
  },
  {
    id: "2",
    name: "Top Naranja Bohemio",
    description: "Top naranja con diseño bohemio, escote en V y mangas largas. Ideal para un look casual pero sofisticado.",
    price: 64.99,
    image_url: "/ropa2.png",
    category: "Tops",
    size: "S",
    available: true,
  },
  {
    id: "3",
    name: "Vestido Floral",
    description: "Vestido con estampado floral multicolor, corte midi y mangas cortas. Perfecto para primavera y verano.",
    price: 129.99,
    image_url: "/ropa1.png",
    category: "Vestidos",
    size: "L",
    available: true,
  },
  {
    id: "4",
    name: "Chaqueta de Encaje",
    description: "Chaqueta corta de encaje con diseño floral, mangas 3/4 y cierre frontal. Ideal para combinar con vestidos.",
    price: 99.99,
    image_url: "/ropa2.png",
    category: "Chaquetas",
    size: "M",
    available: true,
  },
  {
    id: "5",
    name: "Blusa Romántica",
    description: "Blusa romántica con detalles de encaje y mangas acampanadas. Color rosa suave para un look femenino.",
    price: 79.99,
    image_url: "/ropa1.png",
    category: "Blusas",
    size: "S",
    available: true,
  },
  {
    id: "6",
    name: "Top Casual Naranja",
    description: "Top naranja de estilo casual con nudo frontal y mangas largas. Perfecto para el día a día.",
    price: 54.99,
    image_url: "/ropa2.png",
    category: "Tops",
    size: "L",
    available: true,
  },
]

// Almacenamiento en memoria para reservas (simulando base de datos)
let mockReservations: Array<{
  id: string
  item_id: string
  user_name: string
  user_phone: string
  status: string
  reserved_at: string
  payment_method: "yappy" | "efectivo"
  expires_at: string
}> = [
  // Datos de ejemplo para visualización
  {
    id: "demo-1",
    item_id: "1",
    user_name: "María González",
    user_phone: "+507 6000 0000",
    status: "active",
    reserved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    payment_method: "yappy",
    expires_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 días restantes
  },
  {
    id: "demo-2",
    item_id: "3",
    user_name: "María González",
    user_phone: "+507 6000 0000",
    status: "active",
    reserved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
    payment_method: "efectivo",
    expires_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 días restantes
  },
  {
    id: "demo-3",
    item_id: "5",
    user_name: "María González",
    user_phone: "+507 6000 0000",
    status: "active",
    reserved_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Hace 3 horas
    payment_method: "yappy",
    expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días restantes
  },
]

type CreateReservationParams = {
  itemId: string
  userName: string
  userPhone: string
  paymentMethod: "yappy" | "efectivo"
}

export async function createReservation({ itemId, userName, userPhone, paymentMethod }: CreateReservationParams) {
  try {
    // Check if item is still available
    const item = mockItems.find(item => item.id === itemId)

    if (!item) {
      return { error: "Prenda no encontrada." }
    }

    if (!item.available) {
      return { error: "Lo sentimos, esta prenda ya no está disponible." }
    }

    // Create reservation
    const reservation = {
      id: Date.now().toString(),
      item_id: itemId,
      user_name: userName,
      user_phone: userPhone,
      status: "active",
      reserved_at: new Date().toISOString(),
      payment_method: paymentMethod,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    }

    mockReservations.push(reservation)

    // Mark item as unavailable
    item.available = false

    return { success: true, reservation }
  } catch (error) {
    console.error("[v0] Unexpected error in createReservation:", error)
    return { error: "Ocurrió un error inesperado. Por favor intenta de nuevo." }
  }
}

export async function getUserReservations(userPhone: string) {
  try {
    // Filter reservations for this user
    const userReservations = mockReservations
      .filter(reservation => reservation.user_phone === userPhone && reservation.status === "active")
      .map(reservation => {
        const item = mockItems.find(item => item.id === reservation.item_id)
        return {
          ...reservation,
          clothing_items: item ? { ...item } : null,
        }
      })
      .sort((a, b) => new Date(b.reserved_at).getTime() - new Date(a.reserved_at).getTime())

    return { reservations: userReservations }
  } catch (error) {
    console.error("[v0] Error fetching user reservations:", error)
    return { error: "No se pudieron cargar las reservas." }
  }
}
