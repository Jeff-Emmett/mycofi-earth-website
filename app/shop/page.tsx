import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react"

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary))_1px,_transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Link
          href="/"
          className="absolute left-4 top-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-8 md:top-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MycoFi
        </Link>

        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-primary/10 p-6">
            <ShoppingBag className="h-16 w-16 text-primary" />
          </div>

          {/* Title */}
          <h1 className="mb-4 font-serif text-5xl font-bold text-foreground md:text-6xl">MycoFi Swag</h1>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary">
            <Sparkles className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>

          {/* Description */}
          <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
            We're cultivating something special. Soon you'll be able to wear the mycelial revolution with exclusive
            MycoFi merchandise, books, and more.
          </p>

          {/* Email Signup */}
          <div className="mx-auto max-w-md">
            <form className="flex flex-col gap-3 sm:flex-row">
              <Input type="email" placeholder="Enter your email" className="flex-1 bg-card" />
              <Button type="submit" className="whitespace-nowrap">
                Notify Me
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">Be the first to know when the shop launches</p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground/30">
            <div className="h-px w-16 bg-current" />
            <span className="text-sm">Growing Soon</span>
            <div className="h-px w-16 bg-current" />
          </div>
        </div>
      </div>
    </div>
  )
}
