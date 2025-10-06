import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Network, Sprout, Users } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 opacity-[0.08]">
        <Image src="/images/mushroom-forest.png" alt="" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            <Sprout className="h-4 w-4 text-secondary" />
            <span>Regenerative Economics for a Living Future</span>
          </div>

          <h1
            className="mb-6 text-5xl md:text-7xl font-bold tracking-tight text-balance"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            Exploring <span className="text-primary">MycoFi</span>: Mycelial Design Patterns for Web3 & Beyond
          </h1>

          <p className="mb-8 text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-3xl mx-auto">
            Exploring economic systems inspired by mycelial networks—where cooperation, redistribution, and mutual aid
            create resilient, regenerative communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-base">
              <Link href="https://book.mycofi.earth" target="_blank">
                Read the Book
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
              <Link
                href="https://allthingsdecent.substack.com/p/mycoeconomics-and-permaculture-currencies"
                target="_blank"
              >
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature icons */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-primary/10 p-4">
              <Network className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Interconnected</h3>
            <p className="text-sm text-muted-foreground">
              Like mycelial networks, economic systems thrive through connection
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-secondary/10 p-4">
              <Sprout className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg">Regenerative</h3>
            <p className="text-sm text-muted-foreground">
              Building systems that restore and enhance rather than extract
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-accent/10 p-4">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">Cooperative</h3>
            <p className="text-sm text-muted-foreground">Mutual aid and solidarity over competition and extraction</p>
          </div>
        </div>
      </div>
    </section>
  )
}
