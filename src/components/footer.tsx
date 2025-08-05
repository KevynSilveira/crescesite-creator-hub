"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { ArrowUp, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Transformamos ideias em realidade digital. Criamos sites modernos, 
              responsivos e otimizados para fazer sua empresa crescer na internet.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>contato@crescesite.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "/" },
                { label: "Templates", href: "/templates" },
                { label: "Serviços", href: "/servicos" },
                { label: "Sobre", href: "/sobre" },
                { label: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Site Institucional</span></li>
              <li><span className="text-gray-300">Landing Page</span></li>
              <li><span className="text-gray-300">Loja Virtual</span></li>
              <li><span className="text-gray-300">Design Personalizado</span></li>
              <li><span className="text-gray-300">Suporte Técnico</span></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-900" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 CresceSite. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4 text-sm text-gray-400">
              <button className="hover:text-cyan-400 transition-colors">
                Política de Privacidade
              </button>
              <button className="hover:text-cyan-400 transition-colors">
                Termos de Uso
              </button>
            </div>
            
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}