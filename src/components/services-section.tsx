"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Globe, ShoppingCart, Zap, Palette, Code, Headphones } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Site Institucional",
    description: "Site profissional para apresentar sua empresa",
    features: [
      "Design responsivo",
      "SEO otimizado",
      "Formulário de contato",
      "Integração redes sociais",
      "Certificado SSL",
      "Suporte 30 dias"
    ],
    price: "A partir de R$ 1.200",
    popular: false,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Landing Page",
    description: "Página focada em conversão e vendas",
    features: [
      "Design de alta conversão",
      "Otimização para vendas",
      "Integração com WhatsApp",
      "Analytics avançado",
      "A/B Testing",
      "Suporte 60 dias"
    ],
    price: "A partir de R$ 800",
    popular: true,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: ShoppingCart,
    title: "Loja Virtual",
    description: "E-commerce completo para vender online",
    features: [
      "Catálogo de produtos",
      "Carrinho de compras",
      "Gateway de pagamento",
      "Painel administrativo",
      "Controle de estoque",
      "Suporte 90 dias"
    ],
    price: "A partir de R$ 2.500",
    popular: false,
    gradient: "from-green-500 to-emerald-500"
  }
];

const additionalServices = [
  {
    icon: Palette,
    title: "Design Personalizado",
    description: "Criação de identidade visual única para sua marca"
  },
  {
    icon: Code,
    title: "Desenvolvimento Custom",
    description: "Funcionalidades específicas para suas necessidades"
  },
  {
    icon: Headphones,
    title: "Suporte Técnico",
    description: "Manutenção e atualizações contínuas do seu site"
  }
];

export function ServicesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Nossos Serviços
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções completas para sua presença digital, 
            desde sites institucionais até lojas virtuais
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 ${
                service.popular ? 'ring-2 ring-cyan-500/50 scale-105' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${service.gradient} rounded-lg flex items-center justify-center`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">{service.title}</CardTitle>
                <p className="text-gray-300">{service.description}</p>
              </CardHeader>

              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{service.price}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contato">
                  <Button
                    className={`w-full ${
                      service.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
                        : 'bg-slate-800 hover:bg-slate-700'
                    } text-white border-0 transition-all duration-300`}
                  >
                    Solicitar Orçamento
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-8">Serviços Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{service.title}</h4>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-3xl font-bold text-white mb-4">
            Não encontrou o que procura?
          </h3>
          <p className="text-xl text-gray-300 mb-6">
            Criamos soluções personalizadas para suas necessidades específicas
          </p>
          <Link href="/contato">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-cyan-500/25"
            >
              Falar com Especialista
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}