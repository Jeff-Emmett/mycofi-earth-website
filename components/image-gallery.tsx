import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function ImageGallery() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The Mycelial Vision</h2>
        <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
          Exploring the intersection of natural systems, regenerative economics, and decentralized coordination
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Compost Capitalism</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                Just as mycelium breaks down dead matter to create fertile soil, we can transform dying economic
                structures into nourishment for new regenerative systems. Composting capitalism invokes the cycles of
                decay and renewal inherent in natural ecosystems, recognizing that institutional senescence and the end
                of extractive systems creates the conditions for regenerative abundance.
              </p>

              <div className="pt-4">
                <Button asChild variant="secondary" className="w-full">
                  <a
                    href="https://compostcapitalism.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Compost Capitalism
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Psilocybernetics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                Psilocybernetics explores how mycelial wisdom and cybernetic systems thinking converge to create new
                models of collective coordination. Like mycelial networks that process distributed information, we can
                design systems that enhance collective intelligence and distributed decision-making with new forms of
                economy, democracy, and technology.
              </p>

              <div className="pt-4">
                <Button asChild variant="secondary" className="w-full">
                  <a
                    href="https://psilo-cyber.net/ics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Explore Psilocybernetics
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
