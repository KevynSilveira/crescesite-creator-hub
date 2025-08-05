"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Check, ShoppingCart, Star, Clock } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  features: string[];
  category: string;
  is_featured: boolean;
  delivery_time_days: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (serviceId: string) => {
    if (!user) {
      toast.error('Faça login para adicionar ao carrinho');
      router.push('/login');
      return;
    }

    setAddingToCart(serviceId);

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          service_id: serviceId,
          quantity: 1,
        });

      if (error) throw error;

      toast.success('Serviço adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    } finally {
      setAddingToCart(null);
    }
  };

  const buyNow = async (serviceId: string) => {
    if (!user) {
      toast.error('Faça login para comprar');
      router.push('/login');
      return;
    }

    // Adicionar ao carrinho e redirecionar para checkout
    await addToCart(serviceId);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Carregando serviços...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Nossos Serviços
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Soluções completas para sua presença digital, 
              desde sites institucionais até lojas virtuais
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`relative bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 ${
                  service.is_featured ? 'ring-2 ring-cyan-500/50 scale-105' : ''
                }`}
              >
                {service.is_featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-white mb-2">{service.name}</CardTitle>
                  <p className="text-gray-300 mb-4">{service.short_description}</p>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      R$ {service.price.toFixed(2)}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.delivery_time_days} dias
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <Button
                      onClick={() => buyNow(service.id)}
                      className={`w-full ${
                        service.is_featured
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
                      } text-white border-0 transition-all duration-300`}
                    >
                      Comprar Agora
                    </Button>
                    
                    <Button
                      onClick={() => addToCart(service.id)}
                      disabled={addingToCart === service.id}
                      variant="outline"
                      className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      {addingToCart === service.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400 mr-2"></div>
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-3xl font-bold text-white mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Criamos soluções personalizadas para suas necessidades específicas
            </p>
            <Button
              onClick={() => router.push('/contato')}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-cyan-500/25"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}