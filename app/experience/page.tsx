import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: "01",
    title: "Publicaciones frescas",
    description:
      "Revisamos y subimos piezas únicas al bazar con fotos reales, tallas y precios. Lo nuevo aparece primero en el catálogo.",
  },
  {
    number: "02",
    title: "Reserva inmediata",
    description:
      "Si una prenda te encanta, pulsa “Tomar ahora”. Guardamos tu nombre y teléfono para asegurarla en segundos.",
  },
  {
    number: "03",
    title: "Tiempo de confirmación",
    description:
      "Dispones de 8 a 10 días para completar el pago. Pasado el plazo, liberamos la pieza para la siguiente clienta.",
  },
]

const payments = [
  {
    title: "Yappy",
    description: "Envíanos tu comprobante para confirmar la reserva.",
    icon: "/yappy.webp",
  },
  {
    title: "Efectivo",
    description: "Paga al retirar en nuestro local dentro de Pago Studio, Santiago (Veraguas).",
    icon: null,
  },
]

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 space-y-12">
        <section className="rounded-3xl border border-black/5 bg-white px-6 py-12 sm:px-10 lg:px-16">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">Cómo funciona</p>
            <h1 className="text-4xl font-semibold text-black sm:text-5xl">Tu pieza en tres pasos</h1>
            <p className="max-w-2xl text-sm text-black/60">
              En WhatsApp bastaba escribir “MÍO”. Aquí lo hacemos aún más simple: reserva con un clic, paga con calma y
              retira cuando estés lista.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-3xl border border-black/5 bg-black/5 px-5 py-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50">{step.number}</div>
                <h2 className="mt-4 text-lg font-semibold text-black">{step.title}</h2>
                <p className="mt-2 text-sm text-black/60">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/#catalogo">
              <Button className="rounded-full bg-rose-500 text-white hover:bg-rose-600">Ver catálogo en vivo</Button>
            </Link>
            <Link href="/reservations">
              <Button variant="ghost" className="rounded-full text-black/70 hover:text-black">
                Ver mis reservas
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-black/5 bg-white px-6 py-12 sm:grid-cols-[1fr_auto] sm:px-10 lg:px-16">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">Pagos aceptados</p>
            <h2 className="text-3xl font-semibold text-black">Elige cómo quieres pagar</h2>
            <p className="text-sm text-black/60">
              Confirma tu reserva pagando por Yappy o en efectivo al retirar. Una vez enviado el comprobante, aseguramos
              tu prenda hasta la entrega.
            </p>
            <div className="grid gap-4 sm:max-w-md">
              {payments.map((payment) => (
                <div key={payment.title} className="flex items-center gap-4 rounded-3xl border border-black/5 bg-black/5 px-5 py-4">
                  {payment.icon ? (
                    <Image
                      src={payment.icon}
                      alt={payment.title}
                      width={56}
                      height={56}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-sm font-semibold text-black/60">
                      $
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-black">{payment.title}</p>
                    <p className="text-sm text-black/60">{payment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-rose-200 bg-rose-500/10 px-6 py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-600/80">Retiro</p>
              <h3 className="mt-3 text-2xl font-semibold text-rose-600">Pago Studio · Santiago</h3>
              <p className="mt-2 text-sm text-rose-600/80">
                Encuéntranos en Santiago, Veraguas. Coordina tu visita luego de confirmar el pago para entregar o probar tu
                prenda.
              </p>
            </div>
            <div className="mt-6 space-y-2 text-sm text-rose-600/80">
              <p className="font-medium text-rose-700">Coordenadas</p>
              <p>8.105200, -80.971900</p>
              <Link
                href="https://maps.google.com/?q=8.105200,-80.971900"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 underline underline-offset-4 hover:text-rose-800"
              >
                Abrir en Google Maps
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
