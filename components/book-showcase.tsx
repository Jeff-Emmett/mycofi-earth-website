import Image from "next/image"
import { Button } from "@/components/ui/button"

export function BookShowcase() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image src="/images/mycelial-network-green.png" alt="" fill className="object-cover" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Book Cover */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg blur-2xl transform scale-105" />
              <Image
                src="/images/exploring-mycofi-cover.png"
                alt="Exploring MycoFi: Mycelial Design Patterns for Web3 and Beyond - Book Cover"
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">New Release</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Exploring MycoFi</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Mycelial Design Patterns for Web3 and Beyond
            </p>
            <p className="text-lg leading-relaxed">
              Discover how nature's most sophisticated network architecture can inspire the next generation of
              decentralized systems. This book explores the intersection of mycology, economics, and Web3 technology.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <a href="https://book.mycofi.earth" target="_blank" rel="noopener noreferrer">
                  Read the Book
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#buy-book">Buy the Book</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
