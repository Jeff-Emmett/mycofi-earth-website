import Image from "next/image"

export function ImageGallery() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The Mycelial Vision</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/mushroom-gills.jpg"
              alt="Macro view of mushroom gills showing natural hyphal patterns"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/dreamy-mushrooms.png"
              alt="Ethereal mushrooms in golden light"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/mycelial-network-blue.png"
              alt="Digital visualization of mycelial network connections"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/fractal-mushroom.png"
              alt="Fractal art inspired by mushroom growth patterns"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/mushroom-forest.png"
              alt="Psychedelic mushroom forest with interconnected mycelial roots"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/always-has-been.png"
              alt="The revolution will be mycelial - always has been"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
