import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-3 text-primary" style={{ fontFamily: "var(--font-crimson)" }}>
              MycoFi
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Exploring regenerative economic systems inspired by mycelial networks and nature's resource allocation
              algorithms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://book.mycofi.earth"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Book
                </Link>
              </li>
              <li>
                <Link
                  href="https://allthingsdecent.substack.com/p/mycoeconomics-and-permaculture-currencies"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Substack Article
                </Link>
              </li>
              <li>
                <Link
                  href="https://shop.mycofi.earth"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://links.mycofi.earth"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Links
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MycoFi. Building regenerative futures together.</p>
        </div>
      </div>
    </footer>
  )
}
