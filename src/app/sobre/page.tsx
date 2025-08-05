import { Header } from "@/components/header";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      <Header />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}