import { Mail, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="mb-16">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              Let's Anastomose
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
              Just as mycelial networks form connections through anastomosis—fusing together to create stronger, more
              resilient networks—we'd love to connect and collaborate with you.
            </p>
          </div>

          {/* Animated Mycelium Image */}
          <div className="mb-16">
            <div className="relative w-full aspect-[16/9] overflow-hidden border border-border/50 shadow-sm">
              <Image
                src="/mycelium-hyphal-threads-connecting-and-anastomosin.jpg"
                alt="Mycelium hyphal threads connecting through anastomosis"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-12">
            {/* Contact Information */}
            <div className="border-l-4 border-primary pl-6 py-4">
              <h2 className="text-2xl font-bold mb-6 text-foreground" style={{ fontFamily: "var(--font-crimson)" }}>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-semibold text-foreground">Email</h3>
                  </div>
                  <a
                    href="mailto:connect@mycofi.earth"
                    className="text-foreground/70 hover:text-primary transition-colors underline decoration-1 underline-offset-4"
                  >
                    connect@mycofi.earth
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <LinkIcon className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-semibold text-foreground">ENS Address</h3>
                  </div>
                  <div className="font-mono text-foreground/70">mycofi.eth</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-l-4 border-secondary pl-6 py-4">
              <h2 className="text-2xl font-bold mb-4 text-foreground" style={{ fontFamily: "var(--font-crimson)" }}>
                Social Channels
              </h2>
              <p className="text-foreground/70 mb-6">Connect with us across all platforms through our link hub.</p>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <a href="https://links.mycofi.earth" target="_blank" rel="noopener noreferrer">
                  View All Social Links →
                </a>
              </Button>
            </div>

            {/* Engagements */}
            <div className="border-l-4 border-accent pl-6 py-4">
              <h2 className="text-2xl font-bold mb-4 text-foreground" style={{ fontFamily: "var(--font-crimson)" }}>
                Collaboration Opportunities
              </h2>
              <p className="text-foreground/70 mb-8 leading-relaxed">
                We welcome engagements for speaking opportunities, co-publishing initiatives, and consulting on
                regenerative economic design.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border-l-2 border-secondary/50 pl-4">
                  <div className="text-lg font-semibold mb-2 text-foreground">Speaking</div>
                  <p className="text-sm text-foreground/60">Conferences, workshops, and events</p>
                </div>
                <div className="border-l-2 border-secondary/50 pl-4">
                  <div className="text-lg font-semibold mb-2 text-foreground">Co-Publishing</div>
                  <p className="text-sm text-foreground/60">Research, articles, and content</p>
                </div>
                <div className="border-l-2 border-secondary/50 pl-4">
                  <div className="text-lg font-semibold mb-2 text-foreground">Consulting</div>
                  <p className="text-sm text-foreground/60">Regenerative economic design</p>
                </div>
              </div>
              <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white">
                <a href="mailto:connect@mycofi.earth?subject=Collaboration Inquiry">Get in Touch →</a>
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-foreground/60 leading-relaxed">
              Like mycelium, we grow stronger through connection. Let's build regenerative futures together.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
