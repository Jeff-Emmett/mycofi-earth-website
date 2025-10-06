import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function ContentSection() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <Image src="/images/mycelial-network-blue.png" alt="" fill className="object-cover" />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 text-balance"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              From Monoculture to <span className="text-primary">Permaculture</span> Currencies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Emulating nature's evolutionary resource allocation algorithms in economic systems design
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                    The Problem
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-crimson)" }}>
                  Currency Monocultures
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Modern economics emerged alongside imperialist expansion, imposing monocultures of colonizing
                  currencies that undermine collective health and indigenous wisdom.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The myth of "homo economicus" and the rational actor prioritizes individual gain over collective
                  wellbeing, threatening our continued existence on this planet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary mb-4">
                    The Solution
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-crimson)" }}>
                  Permaculture Currencies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Like mycelial networks that redistribute resources through underground connections, we can design
                  economic systems based on cooperation and mutual aid.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Indigenous peoples lived within egalitarian networks ensuring no one's basic needs went unfulfilled—a
                  model we can learn from and adapt for our future.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
                    Nature's Wisdom
                  </div>
                  <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-crimson)" }}>
                    Learning from Fungi
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Since the dawn of life on Earth, fungi have played a pivotal role in the networked redistribution of
                    life-sustaining resources on a global scale.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Mother trees intelligently redistribute their photosynthesized sustenance among their kin through
                    underground mycelial networks—a living example of resource sharing and collective care.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Everything alive today owes a debt of gratitude to the upward trophic flows of energy resulting from
                    mycelial economies over time immemorial.
                  </p>
                </div>
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/mycelial-network-underground-fungal-threads-connec.jpg"
                    alt="Mycelial network illustration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                    The Current Reality
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-crimson)" }}>
                  Society is Trippin Balls
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our collective hallucination of infinite growth on a finite planet has us chasing extractive
                  capitalism down a rabbit hole of ecological collapse.
                </p>
                <a
                  href="https://trippinballs.lol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Explore the trip →
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors bg-gradient-to-br from-card to-secondary/5">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary mb-4">
                    The Emerging Future
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-crimson)" }}>
                  Post-Appitalism Awaits
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Beyond post-capitalism lies post-appitalism—where decentralized applications enable regenerative
                  economies, mutual aid networks, and collective flourishing.
                </p>
                <a
                  href="https://post-appitalism.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  Enter the future →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
