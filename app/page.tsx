import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Packages } from "./components/Packages";
import { FreeTrial } from "./components/FreeTrial";
import { getActivePackages } from "./lib/packages";
import { VideoSection } from "./components/VideoSection";
import { Gallery } from "./components/Gallery";
import { Reviews } from "./components/Reviews";
import { FinalCTA, Footer } from "./components/Footer";
import { FloatingCTA } from "./components/FloatingCTA";
import { SmoothScroll } from "./components/SmoothScroll";
import { ScrollProgress } from "./components/ScrollProgress";
import { Preloader } from "./components/Preloader";

// Serve a cached static render and refresh hourly; admin package edits call
// revalidatePath("/") for instant updates, so this only affects idle drift.
export const revalidate = 3600;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Breathe Ladies Fitness",
  description:
    "An elegant women-only gym & wellness club in Al Malqa, Riyadh. Premium training, spa and a free trial session.",
  image: "https://breathe-ladies.sa/images/hero.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al Malqa",
    addressLocality: "Riyadh",
    postalCode: "13525",
    addressCountry: "SA",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "120",
  },
  priceRange: "SAR 700 – 4,370",
  openingHours: "Sa-Th 08:00-23:00",
};

export default async function Home() {
  const packages = await getActivePackages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Packages packages={packages} />
        <FreeTrial packages={packages} />
        <VideoSection />
        <Gallery />
        <Reviews />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
