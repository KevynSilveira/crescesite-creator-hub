"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Clock, Shield, Rocket, Heart } from "lucide-react";

const stats = [
  { number: "500+", label: "Projetos Entregues", icon: Rocket },
  { number: "5 anos", label: "de Experiência", icon: Clock },
  { number: "98%", label: "Clientes Satisfeitos", icon: Heart },
  { number: "24/7", label: "Suporte Disponível", icon: Shield }
];

const differentials = [
  {
    icon: Award,
    title: "Qualidade Garantida",
    description: "Todos os nossos projetos passam por rigoroso controle de qualidade e testes antes da entrega."
  },
  {
    icon: Users,
    title: "Equipe Especializada",
    description: "Profissionais experientes em design, desenvolvimento e marketing digital trabalhando para você."
  },
  {
    icon: Rocket,
    title: "Tecnologia de Ponta",
    description: "Utilizamos as mais modernas tecnologias e frameworks para garantir performance e segurança."
  },
  {
    icon: Shield,
    title: "Suporte Contínuo",
    description: "Oferecemos suporte técnico e manutenção para manter seu site sempre atualizado e funcionando."
  }
];

export function AboutSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Sobre a CresceSite
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transformamos ideias em realidade digital há mais de 5 anos, 
            ajudando empresas a crescerem na internet
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Nossa História</h3>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                A CresceSite nasceu da paixão por tecnologia e do desejo de ajudar 
                empresas a alcançarem seu potencial máximo no mundo digital.
              </p>
              <p>
                Começamos como uma pequena equipe de desenvolvedores e designers, 
                e hoje somos uma empresa consolidada no mercado, com centenas de 
                projetos entregues e clientes satisfeitos em todo o Brasil.
              </p>
              <p>
                Nossa missão é democratizar o acesso a sites profissionais e 
                modernos, oferecendo soluções de qualidade a preços justos, 
                sempre com foco na experiência do usuário e nos resultados do cliente.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Differentials */}
        <div>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Nossos Diferenciais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentials.map((differential, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <differential.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {differential.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {differential.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700">
            <h4 className="text-2xl font-bold text-cyan-400 mb-4">Missão</h4>
            <p className="text-gray-300">
              Democratizar o acesso a sites profissionais, ajudando empresas 
              a crescerem no mundo digital com soluções de qualidade.
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700">
            <h4 className="text-2xl font-bold text-purple-400 mb-4">Visão</h4>
            <p className="text-gray-300">
              Ser referência nacional em criação de sites, reconhecida pela 
              inovação, qualidade e excelência no atendimento.
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700">
            <h4 className="text-2xl font-bold text-green-400 mb-4">Valores</h4>
            <p className="text-gray-300">
              Transparência, qualidade, inovação, compromisso com resultados 
              e foco total na satisfação do cliente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}