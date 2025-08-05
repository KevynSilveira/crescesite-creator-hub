import { Header } from "@/components/header";
import { TemplatesSection } from "@/components/templates-section";
import { Footer } from "@/components/footer";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      <Header />
      <main className="pt-20">
        <TemplatesSection />
      </main>
      <Footer />
    </div>
  );
}