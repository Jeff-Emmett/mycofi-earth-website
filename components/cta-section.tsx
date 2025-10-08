import Link from "next/link"
import { BookOpen, ExternalLink, ShoppingBag } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 text-balance"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              Welcome to the Myco-Economic Future
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Dive deeper into regenerative economics and permaculture currencies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="https://book.mycofi.earth" target="_blank" className="group">
              <div className="h-full p-6 rounded-lg border-2 border-border hover:border-primary transition-all hover:shadow-lg bg-card">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">The Book</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Read the full exploration of mycoeconomics and regenerative systems
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Read Now <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href="https://shop.mycofi.earth" target="_blank" className="group">
              <div className="h-full p-6 rounded-lg border-2 border-border hover:border-secondary transition-all hover:shadow-lg bg-card">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">The Shop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support the movement with books, resources, and more
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  Visit Shop <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href="https://links.mycofi.earth" target="_blank" className="group">
              <div className="h-full p-6 rounded-lg border-2 border-border hover:border-accent transition-all hover:shadow-lg bg-card">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <ExternalLink className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">All Links</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect with the MycoFi community across platforms</p>
                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                  View Links <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
