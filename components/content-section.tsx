import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ContentSection() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
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
            <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <Image src="/images/fractal-mushroom.png" alt="" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/85 to-background/70 pointer-events-none" />
              <CardContent className="p-8 relative z-10">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-lg bg-red-600/20 px-4 py-2 text-base font-semibold text-red-600 mb-4">
                    The Problem
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-center" style={{ fontFamily: "var(--font-crimson)" }}>
                  Currency Monocultures
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Modern economics emerged alongside imperialist expansion, imposing monocultures of colonizing
                  currencies that undermine collective health and indigenous wisdom.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    "By collapsing all value into the singular unit of bank-issued money, capitalism erodes all other sources of value. The immeasurable wealth provided by social and environmental benefits is extracted into dollars by the unyielding logic of profit-maximization."
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <Image src="/images/mycelial-network-green.png" alt="" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/85 to-background/70 pointer-events-none" />
              <CardContent className="p-8 relative z-10">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-lg bg-secondary/20 px-4 py-2 text-base font-semibold text-secondary mb-4">
                    The Opportunity
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-center" style={{ fontFamily: "var(--font-crimson)" }}>
                  Permaculture Currencies
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Like mycelial networks that redistribute a plethora of resources through underground connections, we
                  can design multi-dimensional economic systems capable of representing multiple localized forms of
                  value.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">{""}</p>
                <p className="text-muted-foreground leading-relaxed">
                  By enabling the localized production of alternative currencies, purpose-driven groups of people can
                  recognize commitments of care and societal regeneration, participating in economies based on
                  cooperation and mutual aid.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="bg-emerald-700 text-white !opacity-100 hover:bg-emerald-600">
              <a
                href="https://mycofi.substack.com/p/from-monoculture-to-permaculture"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more about Permaculture Currencies →
              </a>
            </Button>
          </div>

          <Card className="border-2 bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
                    Listening to Nature's Wisdom
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
            <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 opacity-45 pointer-events-none">
                <Image src="/images/mushroom-forest.png" alt="" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/65 pointer-events-none" />
              <CardContent className="p-8 relative z-10 flex flex-col">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-lg bg-red-600/20 px-4 py-2 text-base font-semibold text-red-600 mb-4">
                    The Current Reality
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-center" style={{ fontFamily: "var(--font-crimson)" }}>
                  Society is Trippin Balls
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our collective hallucination of infinite growth on a finite planet has us chasing extractive
                  capitalism down a rabbit hole of ecological collapse. Envisioning the end of the world before the end
                  of capitalism is a societal-scale bad trip.
                </p>
                <div className="mt-auto flex justify-center">
                  <Button asChild variant="secondary" className="bg-rose-500 text-white !opacity-100 hover:bg-rose-400">
                    <a href="https://trippinballs.lol" target="_blank" rel="noopener noreferrer">
                      Don't Be Trippin' →
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 opacity-45 pointer-events-none">
                <Image src="/images/dreamy-mushrooms.png" alt="" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/65 pointer-events-none" />
              <CardContent className="p-8 relative z-10 flex flex-col">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-lg bg-secondary/20 px-4 py-2 text-base font-semibold text-secondary mb-4">
                    The Emerging Future
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-center" style={{ fontFamily: "var(--font-crimson)" }}>
                  Post-Appitalism Awaits
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A key part of post-capitalism is post-APPitalism—where decentralized applications dissolve the silos of traditional app models (premised on capitalist value extraction) to enable new technologies for collective flourishing.
                </p>
                <div className="mt-auto flex justify-center">
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-emerald-700 text-white !opacity-100 hover:bg-emerald-600"
                  >
                    <a href="https://post-appitalism.app" target="_blank" rel="noopener noreferrer">
                      Enter the future →
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
