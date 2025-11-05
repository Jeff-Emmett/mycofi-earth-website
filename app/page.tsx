import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MycoFiIntro } from "@/components/mycofi-intro"
import { BookShowcase } from "@/components/book-showcase"
import { ImageGallery } from "@/components/image-gallery"
import { ContentSection } from "@/components/content-section"
import { MycopunkSection } from "@/components/mycopunk-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { HyphalCanvas } from "@/components/hyphal-canvas"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HyphalCanvas />
      <Header />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <MycoFiIntro />
        <BookShowcase />
        <ContentSection />
        <ImageGallery />
        <MycopunkSection />
        <CTASection />
      </main>
      <Footer className="z-20" />
    </div>
  )
}
