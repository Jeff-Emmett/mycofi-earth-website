import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function MycoFiIntro() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Hyphal thread pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hyphal-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M10,50 Q30,20 50,50 T90,50 M20,30 Q40,60 60,30 T100,30 M5,70 Q25,90 45,70 T85,70"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hyphal-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-secondary/5 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="rounded-full bg-primary/10 p-3 mt-1">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4 text-balance"
                    style={{ fontFamily: "var(--font-crimson)" }}
                  >
                    What is MycoFi?
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">MycoFi</strong> (Mycelial Finance) is an exploration of{" "}
                    <strong className="text-foreground">mycoeconomics</strong>—economic systems inspired by the
                    intelligence of fungal networks. Just as mycelium redistributes nutrients through underground
                    connections, MycoFi envisions decentralized financial systems built on cooperation, mutual aid, and
                    regenerative principles.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    By emulating nature's evolutionary resource allocation algorithms, we can design Web3 protocols and
                    economic structures that prioritize collective wellbeing over extractive growth—moving from currency
                    monocultures to diverse, resilient permaculture currencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
