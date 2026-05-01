import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Sprout, Users, Lock } from "lucide-react"
import { MushroomQR } from "@/components/mushroom-qr"
import { PaymentWidget } from "@/components/payment-widget"

export const metadata: Metadata = {
  title: "Buy It Forward — MycoFi",
  description:
    "Pay it forward: gift a copy of Exploring MycoFi to a curious mind. Pay by card, wallet, crypto, or bank — mycelial reciprocity in action.",
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

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-12 md:py-16">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MycoFi
        </Link>

        {/* Hero — compact, payment is the primary action below */}
        <header className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-6xl">Buy It Forward</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Gift a copy of <em>Exploring MycoFi</em> to a curious mind who can't yet afford one. Mycelium thrives on
            reciprocity.
          </p>
        </header>

        {/* PRIMARY PAYMENT WIDGET — top of page */}
        <section className="mx-auto mb-16 w-full max-w-xl">
          <PaymentWidget variant="full" defaultAmount={60} defaultMethod="card" />
        </section>

        {/* Why — mycelial reciprocity */}
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

        {/* Tier descriptions (informational — payment widget at top is the primary CTA) */}
        <section className="mb-16">
          <h2 className="mb-2 text-center font-serif text-3xl font-bold">What each tier funds</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground">
            Pick any amount in the form above — these tiers are reference points, not gates.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => (
              <Card key={t.amount} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between font-serif">
                    <span>{t.label}</span>
                    <span className="text-2xl text-primary">${t.amount}</span>
                  </CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* QR — share the page */}
        <section className="mb-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="mb-3 font-serif text-3xl font-bold">Share the spore print</h2>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              Print this on a flyer, slide it into your zine, tape it to a co-working wall. Anyone who scans lands
              right back on this page and can sponsor a copy in seconds.
            </p>
            <p className="text-sm text-muted-foreground">
              Encoded URL: <code className="rounded bg-muted px-1.5 py-0.5">mycofi.earth/buy-it-forward</code>
            </p>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <MushroomQR data="https://mycofi.earth/buy-it-forward" size={300} />
          </div>
        </section>

        {/* SECONDARY PAYMENT WIDGET — at the end */}
        <section className="mx-auto mb-12 w-full max-w-xl">
          <h2 className="mb-4 text-center font-serif text-2xl font-bold">Ready to sponsor?</h2>
          <PaymentWidget variant="compact" defaultAmount={60} defaultMethod="card" />
        </section>

        {/* Notify-at-launch fallback */}
        <section className="rounded-2xl border border-border bg-card/50 p-6 md:p-10">
          <h2 className="mb-3 font-serif text-2xl font-bold">Get notified at launch</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Payment gateway is being wired up via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">payment-forge</code> (Stripe for cards,
            Apple/Google Pay wallets, Openfort for crypto, Cybrid for bank ramps). We'll email you the moment it's
            live.
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
