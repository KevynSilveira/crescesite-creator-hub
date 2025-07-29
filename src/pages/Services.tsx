import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface Service {
  id: string
  title: string
  description: string
  price: number
  features: string[]
  is_featured: boolean
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nossos
            <span className="gradient-tech bg-clip-text text-transparent"> Serviços</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos soluções completas em desenvolvimento web, desde landing pages até e-commerces complexos
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-muted rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`shadow-card transition-smooth hover:shadow-glow relative ${
                  service.is_featured ? 'border-primary shadow-glow' : ''
                }`}
              >
                {service.is_featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-tech text-white">Mais Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">
                      R$ {service.price.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${service.is_featured ? 'shadow-glow' : ''}`}
                    variant={service.is_featured ? 'default' : 'outline'}
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Precisa de algo personalizado?</CardTitle>
              <CardDescription className="text-lg">
                Desenvolvemos soluções sob medida para atender às necessidades específicas do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Consultoria Técnica</h4>
                  <p className="text-sm text-muted-foreground">
                    Análise completa das suas necessidades
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Desenvolvimento Ágil</h4>
                  <p className="text-sm text-muted-foreground">
                    Entregas rápidas e iterativas
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Suporte Contínuo</h4>
                  <p className="text-sm text-muted-foreground">
                    Acompanhamento pós-lançamento
                  </p>
                </div>
              </div>
              <Button size="lg" className="shadow-glow">
                Falar com Especialista
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Services