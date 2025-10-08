import Link from "next/link"
import { Sprout } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div
              className="text-2xl font-bold mb-3 text-primary !opacity-100"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              MycoFi
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-black !opacity-100">
              <Sprout className="h-4 w-4 text-secondary" />
              <span>Regenerative Economics for a Living Future</span>
            </div>
            <p className="text-sm text-black !opacity-100 max-w-md leading-relaxed">
              Exploring regenerative economic systems inspired by mycelial networks and nature's resource allocation
              algorithms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-black !opacity-100">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://book.mycofi.earth"
                  target="_blank"
                  className="text-black !opacity-100 hover:text-primary transition-colors"
                >
                  The Book
                </Link>
              </li>
              <li>
                <Link
                  href="https://allthingsdecent.substack.com/p/mycoeconomics-and-permaculture-currencies"
                  target="_blank"
                  className="text-black !opacity-100 hover:text-primary transition-colors"
                >
                  Substack Article
                </Link>
              </li>
              <li>
                <Link
                  href="https://shop.mycofi.earth"
                  target="_blank"
                  className="text-black !opacity-100 hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-black !opacity-100">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://links.mycofi.earth"
                  target="_blank"
                  className="text-black !opacity-100 hover:text-primary transition-colors"
                >
                  All Links
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-black !opacity-100">
          <p>© {new Date().getFullYear()} MycoFi. Building regenerative futures together.</p>
        </div>
      </div>
    </footer>
  )
}
