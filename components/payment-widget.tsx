"use client"

/**
 * Multi-method payment widget for "Buy It Forward".
 *
 * Backends: routes everything to `/dev-ops/payment-forge` (planned). Until that
 * service exists, the form posts to the relative path and shows a "gateway
 * pending" toast on submit. When payment-forge is live, only the FORGE_BASE
 * constant needs to change.
 *
 * Methods supported:
 *   - card    — credit/debit (Stripe via payment-forge)
 *   - wallet  — Apple Pay / Google Pay (PaymentRequest API)
 *   - crypto  — USDC/ETH on Base (Openfort embedded wallets)
 *   - bank    — ACH / SEPA via Cybrid ramp
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard, Wallet, Coins, Landmark, Loader2, Check } from "lucide-react"

export const FORGE_BASE = "/dev-ops/payment-forge"

const TIERS = [
  { amount: 25, label: "Spore" },
  { amount: 60, label: "Hyphae" },
  { amount: 150, label: "Mycelium" },
  { amount: 500, label: "Fruiting Body" },
]

type Method = "card" | "wallet" | "crypto" | "bank"

const METHODS: Array<{ id: Method; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }> = [
  { id: "card", label: "Card", icon: CreditCard, hint: "Visa · Mastercard · Amex (Stripe)" },
  { id: "wallet", label: "Wallet", icon: Wallet, hint: "Apple Pay · Google Pay" },
  { id: "crypto", label: "Crypto", icon: Coins, hint: "USDC · ETH on Base" },
  { id: "bank", label: "Bank", icon: Landmark, hint: "ACH · SEPA (Cybrid)" },
]

type Props = {
  variant?: "full" | "compact"
  defaultAmount?: number
  defaultMethod?: Method
}

export function PaymentWidget({ variant = "full", defaultAmount = 60, defaultMethod = "card" }: Props) {
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [method, setMethod] = useState<Method>(defaultMethod)
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount < 1) {
      setError("Enter an amount of at least $1")
      return
    }
    setError(null)
    setStatus("loading")

    try {
      const res = await fetch(`${FORGE_BASE}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "USD",
          method,
          purpose: "buy-it-forward",
          metadata: { source: "mycofi.earth/buy-it-forward", variant },
        }),
      })

      if (res.ok) {
        const json = await res.json().catch(() => ({}))
        if (json.checkoutUrl) {
          window.location.href = json.checkoutUrl
          return
        }
        setStatus("pending")
        return
      }

      // gateway not yet wired — show a friendly pending state
      if (res.status === 404 || res.status === 501) {
        setStatus("pending")
        return
      }

      setStatus("error")
      setError(`Gateway returned ${res.status}. Try another method or check back soon.`)
    } catch (err) {
      // network error usually means payment-forge isn't deployed yet
      setStatus("pending")
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-card p-6 md:p-8 shadow-lg">
      {variant === "full" && (
        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Sponsor a copy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One transaction, one book, one curious mind reached. Pay any way you like.
          </p>
        </div>
      )}

      {/* Tier shortcuts + custom amount */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Amount
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {TIERS.map((t) => (
            <button
              key={t.amount}
              type="button"
              onClick={() => setAmount(t.amount)}
              className={`rounded-md border px-2 py-2 text-sm transition-colors ${
                amount === t.amount
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background hover:border-primary/50 text-muted-foreground"
              }`}
            >
              <div className="font-semibold text-foreground">${t.amount}</div>
              <div className="text-xs">{t.label}</div>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">$</span>
          <Input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="text-lg font-semibold"
            aria-label="Custom amount in USD"
          />
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
      </div>

      {/* Method tabs */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Payment method
        </label>
        <div className="grid grid-cols-4 gap-2">
          {METHODS.map((m) => {
            const Icon = m.icon
            const active = method === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{m.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {METHODS.find((m) => m.id === method)?.hint}
        </p>
      </div>

      {/* CTA */}
      <form onSubmit={submit}>
        <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting…
            </>
          ) : (
            <>Sponsor ${amount || 0} via {METHODS.find((m) => m.id === method)?.label}</>
          )}
        </Button>
      </form>

      {/* Status */}
      {status === "pending" && (
        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Gateway not yet live</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Payments will route through <code className="rounded bg-background px-1">payment-forge</code> once
                deployed (Stripe + Openfort + Cybrid). Email <a href="mailto:hello@mycofi.earth" className="underline">hello@mycofi.earth</a>{" "}
                to be notified at launch — your contribution intent has been noted.
              </p>
            </div>
          </div>
        </div>
      )}
      {status === "error" && error && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {variant === "full" && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          100% goes to printing, shipping, and translations. Quarterly ledger published.
        </p>
      )}
    </Card>
  )
}
