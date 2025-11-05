import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MycopunkSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-balance"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              Born from <span className="text-primary">Mycopunk</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              MycoFi emerged from the Mycopunk movement—a regenerative, networked approach to building resilient systems
              inspired by fungal wisdom.
            </p>
          </div>

          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video">
                <Image
                  src="/images/mycopunk-principles.png"
                  alt="Mycopunk Principles: Regenerative, Redistributive, Networked, Humble, Sneaky AF, Anti-Fragile, Fractal, Mutualist, Emergent, Polycentric, Dynamic, Optimistic, Ubiquitous"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  These principles guide our exploration of regenerative economic systems—from the humble mycelial
                  networks beneath our feet to the emergent possibilities of decentralized coordination.
                </p>
                <Button asChild size="lg" variant="secondary">
                  <Link href="https://mycopunks.gitbook.io/mycopunk-principles" target="_blank">
                    Explore the Principles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
