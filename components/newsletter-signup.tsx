"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sprout } from "lucide-react"

const LISTMONK_URL = "https://newsletter.jeffemmett.com"
const LIST_UUID = "d076325f-f39a-44a2-874d-2026c7eb6d1c" // MycoFi list

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus("loading")

    try {
      const response = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          list_uuids: [LIST_UUID],
          name: "",
        }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage("Merge in to the mesh.")
        setEmail("")
      } else {
        throw new Error("Subscription failed")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-emerald-50/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-black">
            <Sprout className="h-4 w-4 text-secondary" />
            <span>Stay Connected</span>
          </div>

          <div className="space-y-2">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              Join the Mycelial Network
            </h2>
            <p className="text-muted-foreground">
              Subscribe for updates on regenerative economics, mycoeconomics research,
              and building regenerative futures.
            </p>
          </div>

          {status === "success" ? (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="px-6"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="text-sm text-red-500">{message}</p>
          )}

          <p className="text-xs text-muted-foreground">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  )
}
