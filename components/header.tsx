import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold tracking-tight text-primary" style={{ fontFamily: "var(--font-crimson)" }}>
            MycoFi
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="https://links.mycofi.earth"
            target="_blank"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            LinkTree
          </Link>
          <Link
            href="https://shop.mycofi.earth"
            target="_blank"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <Link
            href="https://book.mycofi.earth"
            target="_blank"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Read the Book
          </Link>
        </nav>

        <Button asChild className="hidden md:inline-flex">
          <Link href="#buy-book" target="_blank">
            Buy the Book
          </Link>
        </Button>

        <Button asChild variant="outline" className="md:hidden bg-transparent">
          <Link href="https://links.mycofi.earth" target="_blank">
            Links
          </Link>
        </Button>
      </div>
    </header>
  )
}
