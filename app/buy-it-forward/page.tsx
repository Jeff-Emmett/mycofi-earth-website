import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Heart, Sprout, Users, Lock } from "lucide-react"
import { MushroomQR } from "@/components/mushroom-qr"

export const metadata: Metadata = {
  title: "Buy It Forward — MycoFi",
  description:
    "Pay it forward: gift a copy of Exploring MycoFi to a curious mind. Mycelial reciprocity in action.",
  openGraph: {
    title: "Buy It Forward — MycoFi",
    description: "Gift a copy of Exploring MycoFi to a curious mind.",
    url: "https://mycofi.earth/buy-it-forward",
  },
}

const TIERS = [
  { amount: 25, label: "Spore", desc: "Sponsor 1 digital copy for a community member" },
  { amount: 60, label: "Hyphae", desc: "Sponsor 1 print copy + shipping" },
  { amount: 150, label: "Mycelium", desc: "Sponsor a stack of 3 print copies for a study circle" },
  { amount: 500, label: "Fruiting Body", desc: "Sponsor a workshop kit + 10 books for an event" },
]

export default function BuyItForwardPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary))_1px,_transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-12 md:py-20">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MycoFi
        </Link>

        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-5">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-6xl">Buy It Forward</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Mycelium thrives on reciprocity. Gift a copy of <em>Exploring MycoFi</em> to a curious mind who can't
            yet afford one — students, organizers, regenerative practitioners. Every copy seeds another node in
            the network.
          </p>
        </header>

        <section className="mb-16 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Sprout className="h-8 w-8 text-primary" />
              <CardTitle className="font-serif">How it works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You sponsor a copy. We hold the credit and pair it with a request from our community waitlist.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="font-serif">Who receives</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Curious readers from regenerative communities, study circles, and Web3-public-goods organizers.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary" />
              <CardTitle className="font-serif">Where it goes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              100% of contributions cover printing, shipping, and a small reserve for translations. Ledger
              published quarterly.
            </CardContent>
          </Card>
        </section>

        <section className="mb-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold">Choose a tier</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {TIERS.map((t) => (
                <Card key={t.amount} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-baseline justify-between font-serif">
                      <span>{t.label}</span>
                      <span className="text-2xl text-primary">${t.amount}</span>
                    </CardTitle>
                    <CardDescription>{t.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled aria-label={`Sponsor ${t.label} (gateway pending)`}>
                      Sponsor {t.label}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 border-dashed">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Custom amount</CardTitle>
                <CardDescription>Give what feels right.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex gap-2"
                  // gateway placeholder — wire to Stripe/Coinbase Commerce once selected
                >
                  <Input type="number" min={1} placeholder="USD" aria-label="Custom amount in USD" />
                  <Button type="submit" disabled>
                    Sponsor
                  </Button>
                </form>
                <p className="mt-3 text-xs text-muted-foreground">
                  Payment gateway pending. We're evaluating Stripe (cards), Coinbase Commerce (USDC/ETH), and
                  Gitcoin Grants integration. Drop your email below to be notified at launch.
                </p>
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col items-center justify-start gap-6 lg:pt-2">
            <div className="text-center">
              <h2 className="mb-2 font-serif text-2xl font-bold">Share the spore print</h2>
              <p className="text-sm text-muted-foreground">
                Scan or share this code to send someone here directly.
              </p>
            </div>
            <MushroomQR data="https://mycofi.earth/buy-it-forward" size={300} />
            <p className="text-xs text-muted-foreground">mycofi.earth/buy-it-forward</p>
          </aside>
        </section>

        <section className="rounded-2xl border border-border bg-card/50 p-6 md:p-10">
          <h2 className="mb-3 font-serif text-2xl font-bold">Get notified at launch</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            We'll email you the moment the gateway is live. No spam — just the signal.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row" aria-label="Notify me when payments open">
            <Input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="sm:flex-1"
            />
            <Button type="submit">Notify me</Button>
          </form>
        </section>

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          A MycoPunk publication from the Greenpill Network · Reciprocity over extraction.
        </footer>
      </div>
    </div>
  )
}
