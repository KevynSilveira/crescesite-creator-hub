"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Eye, Star } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Corporate Pro",
    category: "Empresarial",
    image: "/api/placeholder/400/300",
    rating: 4.9,
    features: ["Responsivo", "SEO Otimizado", "Animações"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "E-commerce Elite",
    category: "Loja Virtual",
    image: "/api/placeholder/400/300",
    rating: 4.8,
    features: ["Carrinho", "Pagamentos", "Dashboard"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "Landing Focus",
    category: "Landing Page",
    image: "/api/placeholder/400/300",
    rating: 5.0,
    features: ["Conversão", "A/B Testing", "Analytics"],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "Portfolio Creative",
    category: "Portfólio",
    image: "/api/placeholder/400/300",
    rating: 4.7,
    features: ["Galeria", "Animações", "Contato"],
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Restaurant Deluxe",
    category: "Restaurante",
    image: "/api/placeholder/400/300",
    rating: 4.9,
    features: ["Menu Digital", "Reservas", "Delivery"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 6,
    name: "Tech Startup",
    category: "Tecnologia",
    image: "/api/placeholder/400/300",
    rating: 4.8,
    features: ["Moderno", "Interativo", "Mobile First"],
    color: "from-indigo-500 to-purple-500"
  }
];

export function TemplatesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Empresarial", "Loja Virtual", "Landing Page", "Portfólio", "Restaurante", "Tecnologia"];

  const filteredTemplates = selectedCategory === "Todos" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTemplates.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTemplates.length) % filteredTemplates.length);
  };

  const getVisibleTemplates = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % filteredTemplates.length;
      visible.push(filteredTemplates[index]);
    }
    return visible;
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Templates Exclusivos
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Escolha entre nossos designs profissionais e modernos, 
            criados para diferentes tipos de negócio
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentIndex(0);
              }}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0"
                  : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Carousel */}
        <div className="relative">
          <div className="flex justify-center items-center gap-6 mb-8">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
              {getVisibleTemplates().map((template, index) => (
                <Card
                  key={`${template.id}-${currentIndex}-${index}`}
                  className={`bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group ${
                    index === 1 ? 'md:scale-110 md:z-10' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    {/* Template Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className={`w-full h-48 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                        <div className="text-white text-lg font-semibold">
                          {template.name}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{template.rating}</span>
                        </div>
                      </div>
                      <p className="text-cyan-400 text-sm mb-4">{template.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {template.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="px-2 py-1 bg-slate-800 text-xs text-gray-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2">
            {filteredTemplates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-cyan-400 w-8' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-cyan-500/25"
          >
            Ver Todos os Templates
          </Button>
        </div>
      </div>
    </section>
  );
}