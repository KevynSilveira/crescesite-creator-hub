import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, Code, Smartphone, Globe, Zap } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"

interface Model {
  id: string
  title: string
  description: string
  category: string
  image: string
  technologies: string[]
  features: string[]
  demoUrl?: string
  isFeatured?: boolean
}

const models: Model[] = [
  {
    id: "1",
    title: "E-commerce Moderno",
    description: "Loja virtual completa com carrinho, pagamentos e painel administrativo",
    category: "E-commerce",
    image: "/placeholder.svg",
    technologies: ["React", "Node.js", "Stripe", "MongoDB"],
    features: [
      "Carrinho de compras inteligente",
      "Gateway de pagamento integrado",
      "Painel administrativo completo",
      "Sistema de avaliações",
      "Chat em tempo real"
    ],
    demoUrl: "#",
    isFeatured: true
  },
  {
    id: "2",
    title: "Dashboard Analytics",
    description: "Painel de controle com métricas e relatórios em tempo real",
    category: "SaaS",
    image: "/placeholder.svg",
    technologies: ["React", "D3.js", "Firebase", "TypeScript"],
    features: [
      "Gráficos interativos",
      "Relatórios automáticos",
      "Filtros avançados",
      "Exportação de dados",
      "Notificações em tempo real"
    ],
    demoUrl: "#"
  },
  {
    id: "3",
    title: "App Mobile Delivery",
    description: "Aplicativo de delivery com geolocalização e pagamentos",
    category: "Mobile App",
    image: "/placeholder.svg",
    technologies: ["React Native", "Firebase", "Google Maps", "Stripe"],
    features: [
      "Rastreamento em tempo real",
      "Múltiplos métodos de pagamento",
      "Sistema de avaliações",
      "Chat com entregador",
      "Programa de fidelidade"
    ],
    demoUrl: "#"
  },
  {
    id: "4",
    title: "Sistema de Gestão",
    description: "ERP completo para pequenas e médias empresas",
    category: "Software",
    image: "/placeholder.svg",
    technologies: ["React", "PostgreSQL", "Node.js", "Redis"],
    features: [
      "Gestão de estoque",
      "Controle financeiro",
      "Relatórios gerenciais",
      "Sistema de usuários",
      "Backup automático"
    ],
    demoUrl: "#",
    isFeatured: true
  },
  {
    id: "5",
    title: "Landing Page Premium",
    description: "Página de conversão otimizada para marketing digital",
    category: "Website",
    image: "/placeholder.svg",
    technologies: ["React", "Tailwind", "Framer Motion", "Analytics"],
    features: [
      "Design responsivo",
      "Animações suaves",
      "SEO otimizado",
      "A/B Testing",
      "Análise de conversão"
    ],
    demoUrl: "#"
  },
  {
    id: "6",
    title: "Rede Social Corporativa",
    description: "Plataforma de comunicação interna para empresas",
    category: "SaaS",
    image: "/placeholder.svg",
    technologies: ["React", "Socket.io", "MongoDB", "AWS"],
    features: [
      "Chat em tempo real",
      "Grupos e canais",
      "Compartilhamento de arquivos",
      "Videoconferência",
      "Integração com calendário"
    ],
    demoUrl: "#"
  }
]

const categories = ["Todos", "E-commerce", "SaaS", "Mobile App", "Website", "Software"]

const Models = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const heroRef = useScrollReveal()
  const modelsRef = useScrollReveal()

  const filteredModels = selectedCategory === "Todos" 
    ? models 
    : models.filter(model => model.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "E-commerce": return <Smartphone className="w-4 h-4" />
      case "SaaS": return <Zap className="w-4 h-4" />
      case "Mobile App": return <Smartphone className="w-4 h-4" />
      case "Website": return <Globe className="w-4 h-4" />
      case "Software": return <Code className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="animate-scroll-reveal py-20 px-4 md:px-6 lg:px-8 gradient-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center text-white">
          <div className="floating-element mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Nossos
              <span className="block gradient-tech bg-clip-text text-transparent">
                Modelos Premium
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Soluções prontas e personalizáveis para acelerar seu projeto digital
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Ver Demonstrações
              <Eye className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white/30 text-white hover:bg-white/10">
              Solicitar Customização
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
              >
                {category !== "Todos" && getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section 
        ref={modelsRef}
        className="animate-scroll-reveal py-16 px-4 md:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, index) => (
              <Card 
                key={model.id} 
                className={`shadow-card transition-all duration-500 hover:shadow-glow hover:scale-105 ${
                  index % 2 === 0 ? 'animate-fade-in' : 'animate-scale-in'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(model.category)}
                      <Badge variant={model.isFeatured ? "default" : "secondary"}>
                        {model.isFeatured ? "Premium" : model.category}
                      </Badge>
                    </div>
                    {model.isFeatured && (
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <img 
                      src={model.image} 
                      alt={model.title}
                      className="w-full h-full object-cover rounded-lg opacity-50"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">{model.title}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Tecnologias:</h4>
                      <div className="flex flex-wrap gap-1">
                        {model.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Principais funcionalidades:</h4>
                      <ul className="space-y-1">
                        {model.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                        {model.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{model.features.length - 3} funcionalidades
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" size="sm">
                        Ver Detalhes
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      {model.demoUrl && (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 gradient-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="floating-element">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Não encontrou o que procura?
            </h2>
          </div>
          <p className="text-xl mb-8 opacity-90">
            Criamos soluções personalizadas do zero para atender suas necessidades específicas
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Solicitar Projeto Personalizado
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Models