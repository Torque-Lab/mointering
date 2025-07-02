import Header from "../components/landing_page/Header";
import { Footer } from "../components/landing_page/Footer";

export default function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex-none">
        <Header />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
}
