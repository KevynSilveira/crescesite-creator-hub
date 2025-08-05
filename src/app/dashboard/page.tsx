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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  AlertTriangle,
  Home,
  Package,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Calendar,
  Bell,
  Star,
  DollarSign,
  Activity,
  Users,
  BarChart3,
  FileText,
  Download,
  Eye,
  Plus,
  Globe,
  ExternalLink,
  Link as LinkIcon,
  Search,
  Zap,
  Monitor,
  Shield,
  Gauge
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  order_items: {
    service_id: string;
    quantity: number;
    unit_price: number;
    services: {
      name: string;
      category: string;
    };
  }[];
}

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  avatar_url: string;
}

interface Project {
  id: string;
  name: string;
  url: string;
  status: string;
  created_at: string;
  last_check: string;
  ssl_status: boolean;
  performance_score: number;
  uptime: number;
  service_type: string;
  order_id: string;
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
  avgPerformance: number;
  avgUptime: number;
}

export default function DashboardPage() {
  const { user, loading, emailConfirmed, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    activeProjects: 0,
    completedProjects: 0,
    avgPerformance: 0,
    avgUptime: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && emailConfirmed) {
      loadUserData();
    }
  }, [user, emailConfirmed]);

  const loadUserData = async () => {
    try {
      // Carregar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Carregar pedidos
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            service_id,
            quantity,
            unit_price,
            services (name, category)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
        
        // Calcular estatísticas dos pedidos
        const totalSpent = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
        const activeProjects = ordersData.filter(order => 
          ['confirmed', 'in_progress'].includes(order.status)
        ).length;
        const completedProjects = ordersData.filter(order => 
          order.status === 'completed'
        ).length;

        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length,
          totalSpent,
          activeProjects,
          completedProjects
        }));
      }

      // Carregar projetos do banco de dados
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);

        // Calcular estatísticas dos projetos
        const avgPerformance = projectsData.length > 0 
          ? Math.round(projectsData.reduce((sum, p) => sum + p.performance_score, 0) / projectsData.length)
          : 0;
        
        const avgUptime = projectsData.length > 0 
          ? Math.round((projectsData.reduce((sum, p) => sum + parseFloat(p.uptime.toString()), 0) / projectsData.length) * 10) / 10
          : 0;

        setStats(prev => ({
          ...prev,
          avgPerformance,
          avgUptime
        }));
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoadingData(false);
    }
  };

  const resendConfirmationEmail = async () => {
    if (!user?.email) return;
    
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;
      toast.success('E-mail de confirmação reenviado!');
    } catch (error) {
      console.error('Erro ao reenviar e-mail:', error);
      toast.error('Erro ao reenviar e-mail de confirmação');
    } finally {
      setResendingEmail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-500' },
      confirmed: { label: 'Confirmado', variant: 'default' as const, color: 'bg-blue-500' },
      in_progress: { label: 'Em Desenvolvimento', variant: 'default' as const, color: 'bg-purple-500' },
      completed: { label: 'Entregue', variant: 'default' as const, color: 'bg-green-500' },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const, color: 'bg-red-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProjectStatusBadge = (status: string) => {
    const statusConfig = {
      online: { label: 'Online', color: 'bg-green-500' },
      offline: { label: 'Offline', color: 'bg-red-500' },
      maintenance: { label: 'Manutenção', color: 'bg-yellow-500' },
      analyzing: { label: 'Analisando', color: 'bg-blue-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.analyzing;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const methods = {
      'credit_card': { label: 'Cartão de Crédito', color: 'bg-blue-500' },
      'pix': { label: 'PIX', color: 'bg-green-500' },
      'bank_slip': { label: 'Boleto', color: 'bg-orange-500' },
      'paypal': { label: 'PayPal', color: 'bg-blue-600' },
    };
    
    const config = methods[method as keyof typeof methods] || { label: method, color: 'bg-gray-500' };
    return (
      <Badge className={`${config.color} text-white text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    { id: 'orders', label: 'Meus Pedidos', icon: ShoppingBag },
    { id: 'projects', label: 'Meus Projetos', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

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

  // Se usuário não confirmou e-mail
  if (user && !emailConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <Card className="w-full max-w-md bg-slate-900/50 border-slate-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">
                    Confirme seu e-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Alert className="bg-yellow-500/10 border-yellow-500/30">
                    <Mail className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      <strong>E-mail não confirmado!</strong><br />
                      Verifique sua caixa de entrada e clique no link de confirmação para acessar sua conta.
                    </AlertDescription>
                  </Alert>
                  
                  <p className="text-gray-300">
                    Enviamos um e-mail de confirmação para:<br />
                    <strong className="text-white">{user.email}</strong>
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={resendConfirmationEmail}
                      disabled={resendingEmail}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    >
                      {resendingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Reenviar E-mail
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={signOut}
                      variant="outline"
                      className="w-full border-slate-600 text-gray-300 hover:bg-slate-800"
                    >
                      Sair
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Projetos Ativos</p>
                <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'online').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Investido</p>
                <p className="text-2xl font-bold text-white">R$ {stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Uptime Médio</p>
                <p className="text-2xl font-bold text-white">{stats.avgUptime}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Performance</p>
                <p className="text-2xl font-bold text-white">{stats.avgPerformance}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push('/servicos')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Plus className="w-6 h-6" />
              <span>Novo Projeto</span>
            </Button>
            
            <Button
              onClick={() => setActiveTab('orders')}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-800 h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Ver Pedidos</span>
            </Button>
            
            <Button
              onClick={() => setActiveTab('analytics')}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-800 h-auto p-4 flex flex-col items-center space-y-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span>Ver Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projetos Recentes */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              Projetos Recentes
            </div>
            <Button
              onClick={() => setActiveTab('projects')}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Ver todos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Nenhum projeto entregue ainda</p>
              <Button
                onClick={() => router.push('/servicos')}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                Contratar Primeiro Serviço
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">
                      {project.uptime}% uptime
                    </span>
                    {getProjectStatusBadge(project.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-cyan-400" />
            Histórico de Pedidos
          </div>
          <Button
            onClick={() => router.push('/servicos')}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Você ainda não fez nenhum pedido</p>
            <Button
              onClick={() => router.push('/servicos')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              Ver Serviços Disponíveis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-medium text-lg">
                      Pedido #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPaymentStatusIcon(order.payment_status)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-300">{item.services.name}</span>
                          <p className="text-xs text-gray-500">{item.services.category}</p>
                        </div>
                      </div>
                      <span className="text-white font-medium">
                        R$ {item.unit_price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-slate-700 mb-4" />

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-bold text-lg">
                      Total: R$ {order.total_amount.toFixed(2)}
                    </span>
                    {order.payment_method && getPaymentMethodBadge(order.payment_method)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-gray-300 hover:bg-slate-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Nota Fiscal
                    </Button>
                  </div>
                </div>

                {/* Status do Pagamento */}
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status do Pagamento:</span>
                    <div className="flex items-center space-x-2">
                      {getPaymentStatusIcon(order.payment_status)}
                      <span className={`text-sm font-medium ${
                        order.payment_status === 'paid' ? 'text-green-400' :
                        order.payment_status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {order.payment_status === 'paid' ? 'Pago' :
                         order.payment_status === 'failed' ? 'Falhou' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProjects = () => (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Globe className="w-5 h-5 mr-2 text-cyan-400" />
          Meus Projetos Entregues ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Nenhum projeto entregue ainda</p>
            <p className="text-sm text-gray-400 mb-6">
              Seus projetos aparecerão aqui após a conclusão dos pedidos
            </p>
            <Button
              onClick={() => router.push('/servicos')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              Contratar Primeiro Serviço
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-lg">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.service_type}</p>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm mt-1"
                        >
                          {project.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getProjectStatusBadge(project.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        Performance
                      </span>
                      <span className="text-white font-medium">{project.performance_score}/100</span>
                    </div>
                    <Progress value={project.performance_score} className="h-2" />
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Monitor className="w-4 h-4 mr-1" />
                        Uptime
                      </span>
                      <span className="text-white font-medium">{project.uptime}%</span>
                    </div>
                    <Progress value={parseFloat(project.uptime.toString())} className="h-2" />
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        SSL
                      </span>
                      <span className={`font-medium ${project.ssl_status ? 'text-green-400' : 'text-red-400'}`}>
                        {project.ssl_status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {project.ssl_status ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Entregue em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-gray-300 hover:bg-slate-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Resumo Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Performance Média</p>
                <p className="text-2xl font-bold text-white">{stats.avgPerformance}/100</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Gauge className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Uptime Geral</p>
                <p className="text-2xl font-bold text-white">{stats.avgUptime}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Monitor className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Projetos SSL</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.ssl_status).length}/{projects.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics por Projeto */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
            Analytics por Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Nenhum dado de analytics disponível</p>
              <p className="text-sm text-gray-400">
                Os dados aparecerão após a entrega dos projetos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-400">{project.service_type}</p>
                    </div>
                    {getProjectStatusBadge(project.status)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{project.performance_score}</p>
                      <p className="text-xs text-gray-400">Performance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{project.uptime}%</p>
                      <p className="text-xs text-gray-400">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">
                        {project.ssl_status ? '✓' : '✗'}
                      </p>
                      <p className="text-xs text-gray-400">SSL</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return renderOrders();
      case 'projects':
        return renderProjects();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          {/* Header do Dashboard */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Olá, {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}! 👋
                </h1>
                <p className="text-gray-300">
                  Gerencie seus projetos e acompanhe o desempenho
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu Lateral */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/50 border-slate-800 sticky top-24">
                <CardContent className="p-0">
                  <nav className="space-y-1 p-4">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeTab === item.id
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400 border border-cyan-500/30'
                              : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}