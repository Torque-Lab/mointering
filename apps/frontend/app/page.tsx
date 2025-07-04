import Header from "./components/landing_page/Header";
import { Footer } from "./components/landing_page/Footer";
import { HeroSection } from "./components/landing_page/HeroSection";
import { FeatureSection } from "./components/landing_page/FeatureSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex-none">
        <Header/>
      </header>
      <main className="flex-grow m-20 p-10">
        <HeroSection />
        <FeatureSection/>
      </main>
      <footer className="flex-none">
        <Footer />  
      </footer>
    </div>
  );
}
