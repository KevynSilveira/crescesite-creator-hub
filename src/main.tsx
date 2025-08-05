import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple Landing Page Component
function App() {
  // Get current path for simple routing
  const currentPath = window.location.pathname;
  
  // Simple router component
  const renderContent = () => {
    switch(currentPath) {
      case '/services':
        return <ServicesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                CresceSite
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">Início</a>
              <a href="/services" className="text-gray-300 hover:text-cyan-400 transition-colors">Serviços</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Sobre</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contato</a>
            </nav>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
              Começar Projeto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 CresceSite. Transformando empresas no digital.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Home Page Component
function HomePage() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-scroll-reveal">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <span className="text-sm text-gray-300">Tecnologia de Ponta</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Transforme Sua
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Presença Digital
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Criamos sites modernos, responsivos e otimizados que fazem sua empresa 
            <span className="text-cyan-400 font-semibold"> crescer no digital</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex flex-col items-center floating-element">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">500+</span>
              </div>
              <div className="text-2xl font-bold text-white">Sites</div>
              <div className="text-sm text-gray-400">Criados</div>
            </div>
            <div className="flex flex-col items-center floating-element" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">98%</span>
              </div>
              <div className="text-2xl font-bold text-white">Satisfação</div>
              <div className="text-sm text-gray-400">Cliente</div>
            </div>
            <div className="flex flex-col items-center floating-element" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">24h</span>
              </div>
              <div className="text-2xl font-bold text-white">Suporte</div>
              <div className="text-sm text-gray-400">Técnico</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105 px-8 py-3 rounded-lg font-semibold">
              Ver Modelos →
            </button>
            <button className="border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 px-8 py-3 rounded-lg font-semibold">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

// Services Page Component
function ServicesPage() {
  const services = [
    {
      title: "Sites Corporativos",
      description: "Sites profissionais para empresas que querem se destacar no mercado digital",
      price: "A partir de R$ 2.500",
      features: ["Design responsivo", "SEO otimizado", "Painel administrativo", "Suporte 24h"]
    },
    {
      title: "E-commerce",
      description: "Lojas virtuais completas para vender online com segurança e eficiência",
      price: "A partir de R$ 4.500",
      features: ["Gateway de pagamento", "Gestão de estoque", "Relatórios de vendas", "APP mobile"]
    },
    {
      title: "Landing Pages",
      description: "Páginas de conversão otimizadas para campanhas de marketing digital",
      price: "A partir de R$ 1.200",
      features: ["Alta conversão", "Integração com CRM", "A/B Testing", "Analytics avançado"]
    }
  ];

  return (
    <section className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Nossos Serviços
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Oferecemos soluções completas para transformar sua presença digital e fazer seu negócio crescer online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 hover:border-cyan-500/50 transition-all duration-300 floating-element" style={{ animationDelay: `${index * 0.2}s` }}>
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <div className="text-cyan-400 font-bold text-xl mb-6">{service.price}</div>
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                Solicitar Orçamento
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Precisa de algo personalizado?</h3>
            <p className="text-gray-300 mb-6">
              Desenvolvemos soluções sob medida para atender às necessidades específicas do seu negócio
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)