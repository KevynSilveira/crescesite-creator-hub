"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Plus, 
  Download, 
  Eye, 
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'pix' | 'bank_slip';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  description: string;
  downloadUrl?: string;
}

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    try {
      // Carregar pedidos para calcular total gasto
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, payment_status, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersData) {
        const total = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
        setTotalSpent(total);

        // Converter pedidos em faturas
        const invoicesList: Invoice[] = ordersData.map((order, index) => ({
          id: `inv_${index + 1}`,
          amount: order.total_amount,
          status: order.payment_status === 'paid' ? 'paid' : 
                 order.payment_status === 'failed' ? 'failed' : 'pending',
          date: order.created_at,
          description: `Pedido de serviços digitais`,
        }));

        setInvoices(invoicesList);
      }

      // Simular métodos de pagamento (em produção, viria de um gateway)
      setPaymentMethods([
        {
          id: '1',
          type: 'credit_card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados de faturamento:', error);
      toast.error('Erro ao carregar dados de faturamento');
    } finally {
      setLoadingData(false);
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { label: 'Pago', variant: 'default' as const, color: 'bg-green-500' },
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-500' },
      failed: { label: 'Falhou', variant: 'destructive' as const, color: 'bg-red-500' },
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Carregando...</p>
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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header da Página */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="icon"
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Faturamento</h1>
                <p className="text-gray-300">Gerencie seus métodos de pagamento e faturas</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumo Financeiro */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/50 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">
                      R$ {totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">Total investido</p>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Este mês:</span>
                      <span className="text-white">R$ 0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Último pagamento:</span>
                      <span className="text-white">
                        {invoices.length > 0 ? 
                          new Date(invoices[0].date).toLocaleDateString('pt-BR') : 
                          'Nenhum'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métodos de Pagamento */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                      Métodos de Pagamento
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-6">
                      <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300 mb-4">Nenhum método de pagamento</p>
                      <Button
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      >
                        Adicionar Cartão
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-3 border border-slate-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {getPaymentMethodIcon(method.type)}
                            <div>
                              <p className="text-white font-medium">
                                {method.brand} •••• {method.last4}
                              </p>
                              <p className="text-sm text-gray-400">
                                Expira {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge className="bg-green-500 text-white">Padrão</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Histórico de Faturas */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                    Histórico de Faturas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300 mb-4">Nenhuma fatura encontrada</p>
                      <p className="text-sm text-gray-400">
                        Suas faturas aparecerão aqui após realizar compras
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{invoice.description}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(invoice.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-white font-medium">
                                R$ {invoice.amount.toFixed(2)}
                              </p>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(invoice.status)}
                                {getStatusBadge(invoice.status)}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-gray-300 hover:bg-slate-800"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}