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
      <main className="flex-grow flex-wrap mt-20 ">
        <HeroSection />
        <FeatureSection/>
      </main>
      <footer className="flex-none">
        <Footer />  
      </footer>
    </div>
  );
}
