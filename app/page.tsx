import { CatalogGrid } from "@/components/catalog-grid"
import { Header } from "@/components/header"

export default function Home() {
  // Datos mock para desarrollo
  const items = [
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
      available: false,
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
      available: false,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section id="catalogo">
          <CatalogGrid items={items} />
        </section>
      </main>
    </div>
  )
}
