"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, UserPlus, ArrowRight, Shield, Zap, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff, X, Check } from "lucide-react";
import { toast } from "sonner";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up' | 'forgotten_password'>('sign_in');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [resendingEmail, setResendingEmail] = useState(false);
  
  // Estados para registro customizado
  const [customSignUp, setCustomSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Requisitos de senha
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { label: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8, met: false },
    { label: 'Pelo menos 1 letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'Pelo menos 1 letra minúscula', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'Pelo menos 1 número', test: (pwd) => /\d/.test(pwd), met: false },
    { label: 'Pelo menos 1 caractere especial', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false },
  ]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    // Detectar mudanças na view do Auth UI
    const interval = setInterval(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        const buttonText = submitButton.textContent?.toLowerCase() || '';
        if (buttonText.includes('criar') || buttonText.includes('sign up')) {
          if (!customSignUp) {
            setAuthView('sign_up');
            setCustomSignUp(true);
          }
        } else if (buttonText.includes('enviar') || buttonText.includes('send')) {
          setAuthView('forgotten_password');
          setCustomSignUp(false);
        } else {
          setAuthView('sign_in');
          setCustomSignUp(false);
        }
      }

      // Verificar se há mensagem de confirmação
      const confirmationMessage = document.querySelector('.supabase-auth-ui_ui-message');
      if (confirmationMessage && confirmationMessage.textContent?.includes('confirmar')) {
        setShowEmailSent(true);
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput && emailInput.value) {
          setUserEmail(emailInput.value);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [customSignUp]);

  useEffect(() => {
    // Escutar eventos de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (event === 'SIGNED_UP' && !session) {
          setShowEmailSent(true);
          toast.info('E-mail de confirmação enviado! Verifique sua caixa de entrada.');
        }
        
        if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
          toast.error('E-mail não confirmado. Verifique sua caixa de entrada.');
          await supabase.auth.signOut();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Validar e-mail
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Verificar se e-mail já existe
  const checkEmailExists = async (email: string) => {
    if (!isValidEmail(email)) return;
    
    setCheckingEmail(true);
    try {
      // Tentar fazer login com e-mail inexistente para verificar se existe
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-to-check-existence'
      });

      // Se o erro for "Invalid login credentials", o e-mail pode existir
      // Se for "Email not confirmed", o e-mail existe mas não foi confirmado
      if (error?.message.includes('Invalid login credentials') || 
          error?.message.includes('Email not confirmed')) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      console.error('Erro ao verificar e-mail:', error);
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Atualizar requisitos de senha
  const updatePasswordRequirements = (password: string) => {
    setPasswordRequirements(prev => 
      prev.map(req => ({
        ...req,
        met: req.test(password)
      }))
    );
  };

  // Verificar se senha atende todos os requisitos
  const isPasswordValid = () => {
    return passwordRequirements.every(req => req.met);
  };

  // Handle input changes
  const handleSignUpChange = (field: string, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      updatePasswordRequirements(value);
    }
    
    if (field === 'email') {
      setEmailExists(false);
      if (isValidEmail(value)) {
        checkEmailExists(value);
      }
    }
  };

  // Handle custom sign up
  const handleCustomSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!isValidEmail(signUpData.email)) {
      toast.error('Por favor, digite um e-mail válido');
      return;
    }
    
    if (emailExists) {
      toast.error('Este e-mail já está cadastrado. Tente fazer login.');
      return;
    }
    
    if (!isPasswordValid()) {
      toast.error('A senha não atende aos requisitos mínimos');
      return;
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsRegistering(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este e-mail já está cadastrado');
          setEmailExists(true);
        } else {
          toast.error(`Erro ao criar conta: ${error.message}`);
        }
      } else {
        setShowEmailSent(true);
        setUserEmail(signUpData.email);
        toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      toast.error('Erro ao criar conta');
    } finally {
      setIsRegistering(false);
    }
  };

  const resendConfirmationEmail = async () => {
    if (!userEmail) {
      toast.error('E-mail não encontrado. Tente se registrar novamente.');
      return;
    }
    
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        console.error('Erro ao reenviar e-mail:', error);
        toast.error(`Erro ao reenviar e-mail: ${error.message}`);
      } else {
        toast.success('E-mail de confirmação reenviado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao reenviar e-mail:', error);
      toast.error('Erro ao reenviar e-mail de confirmação');
    } finally {
      setResendingEmail(false);
    }
  };

  const getHeaderContent = () => {
    switch (authView) {
      case 'sign_up':
        return {
          icon: <UserPlus className="w-8 h-8 text-white" />,
          title: "Crie sua conta",
          subtitle: "Junte-se a nós e comece a transformar sua presença digital hoje mesmo"
        };
      case 'forgotten_password':
        return {
          icon: <Mail className="w-8 h-8 text-white" />,
          title: "Recuperar senha",
          subtitle: "Digite seu e-mail e enviaremos instruções para redefinir sua senha"
        };
      default:
        return {
          icon: <Lock className="w-8 h-8 text-white" />,
          title: "Bem-vindo de volta!",
          subtitle: "Entre na sua conta para acessar seus projetos e comprar serviços"
        };
    }
  };

  const headerContent = getHeaderContent();

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            {/* Header da página */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                {headerContent.icon}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {headerContent.title}
              </h1>
              <p className="text-gray-300">
                {headerContent.subtitle}
              </p>
            </div>

            {/* Alerta de e-mail enviado */}
            {showEmailSent && (
              <Alert className="mb-6 bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  <strong>E-mail de confirmação enviado!</strong><br />
                  Enviado para: <strong>{userEmail}</strong><br />
                  Verifique sua caixa de entrada e pasta de spam.
                  
                  <div className="mt-3 space-y-2">
                    <Button
                      onClick={resendConfirmationEmail}
                      disabled={resendingEmail}
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {resendingEmail ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Reenviar E-mail
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-white">
                  {authView === 'sign_up' ? 'Criar nova conta' : 
                   authView === 'forgotten_password' ? 'Recuperar acesso' : 
                   'Acesse sua conta'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Formulário customizado de registro */}
                {customSignUp && authView === 'sign_up' ? (
                  <form onSubmit={handleCustomSignUp} className="space-y-4">
                    {/* E-mail */}
                    <div>
                      <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => handleSignUpChange('email', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
                          placeholder="seu@email.com"
                          required
                        />
                        {checkingEmail && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Validação de e-mail */}
                      {signUpData.email && !isValidEmail(signUpData.email) && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          E-mail inválido
                        </p>
                      )}
                      
                      {emailExists && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          Este e-mail já está cadastrado
                        </p>
                      )}
                      
                      {signUpData.email && isValidEmail(signUpData.email) && !emailExists && !checkingEmail && (
                        <p className="text-green-400 text-sm mt-1 flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          E-mail válido
                        </p>
                      )}
                    </div>

                    {/* Senha */}
                    <div>
                      <Label htmlFor="password" className="text-gray-300">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={signUpData.password}
                          onChange={(e) => handleSignUpChange('password', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 pr-10"
                          placeholder="Crie uma senha forte"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Requisitos de senha */}
                      {signUpData.password && (
                        <div className="mt-2 space-y-1">
                          {passwordRequirements.map((req, index) => (
                            <p key={index} className={`text-xs flex items-center ${req.met ? 'text-green-400' : 'text-red-400'}`}>
                              {req.met ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              {req.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirmar senha */}
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signUpData.confirmPassword}
                          onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 pr-10"
                          placeholder="Digite a senha novamente"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Validação de confirmação */}
                      {signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          As senhas não coincidem
                        </p>
                      )}
                      
                      {signUpData.confirmPassword && signUpData.password === signUpData.confirmPassword && signUpData.password && (
                        <p className="text-green-400 text-sm mt-1 flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Senhas coincidem
                        </p>
                      )}
                    </div>

                    {/* Botão de registro */}
                    <Button
                      type="submit"
                      disabled={isRegistering || !isValidEmail(signUpData.email) || emailExists || !isPasswordValid() || signUpData.password !== signUpData.confirmPassword}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      {isRegistering ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar minha conta'
                      )}
                    </Button>

                    {/* Link para login */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomSignUp(false);
                          setAuthView('sign_in');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        Já tem uma conta? Entre aqui
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Auth UI padrão para login e recuperação */
                  <Auth
                    supabaseClient={supabase}
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: '#06b6d4',
                            brandAccent: '#0891b2',
                            brandButtonText: 'white',
                            defaultButtonBackground: '#1e293b',
                            defaultButtonBackgroundHover: '#334155',
                            inputBackground: '#1e293b',
                            inputBorder: '#475569',
                            inputBorderHover: '#06b6d4',
                            inputBorderFocus: '#06b6d4',
                            inputText: 'white',
                            inputLabelText: '#cbd5e1',
                            inputPlaceholder: '#64748b',
                            messageText: '#f1f5f9',
                            messageTextDanger: '#ef4444',
                            anchorTextColor: '#06b6d4',
                            anchorTextHoverColor: '#06b6d4',
                          },
                          space: {
                            spaceSmall: '4px',
                            spaceMedium: '8px',
                            spaceLarge: '16px',
                            labelBottomMargin: '8px',
                            anchorBottomMargin: '4px',
                            emailInputSpacing: '4px',
                            socialAuthSpacing: '4px',
                            buttonPadding: '10px 15px',
                            inputPadding: '10px 15px',
                          },
                          fontSizes: {
                            baseBodySize: '14px',
                            baseInputSize: '14px',
                            baseLabelSize: '14px',
                            baseButtonSize: '14px',
                          },
                          borderWidths: {
                            buttonBorderWidth: '1px',
                            inputBorderWidth: '1px',
                          },
                          radii: {
                            borderRadiusButton: '6px',
                            buttonBorderRadius: '6px',
                            inputBorderRadius: '6px',
                          },
                        },
                      },
                    }}
                    theme="dark"
                    providers={[]}
                    view={authView === 'sign_up' ? 'sign_in' : authView}
                    redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard'}
                    localization={{
                      variables: {
                        sign_in: {
                          email_label: 'Seu e-mail',
                          password_label: 'Sua senha',
                          button_label: 'Entrar na conta',
                          loading_button_label: 'Entrando...',
                          social_provider_text: 'Entrar com {{provider}}',
                          link_text: 'Não tem uma conta? Crie aqui',
                        },
                        sign_up: {
                          email_label: 'Seu e-mail',
                          password_label: 'Crie uma senha',
                          button_label: 'Criar minha conta',
                          loading_button_label: 'Criando conta...',
                          social_provider_text: 'Criar conta com {{provider}}',
                          link_text: 'Não tem uma conta? Crie aqui',
                          confirmation_text: 'Verifique seu e-mail para confirmar a conta',
                        },
                        forgotten_password: {
                          email_label: 'Seu e-mail',
                          button_label: 'Enviar link de recuperação',
                          loading_button_label: 'Enviando...',
                          link_text: 'Esqueceu sua senha?',
                          confirmation_text: 'Verifique seu e-mail para redefinir a senha',
                        },
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Informações sobre validação */}
            {authView === 'sign_up' && customSignUp && (
              <Alert className="mt-4 bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  <strong>Requisitos de segurança:</strong>
                  <ul className="mt-2 text-sm list-disc list-inside">
                    <li>E-mail válido e único</li>
                    <li>Senha forte com todos os requisitos</li>
                    <li>Confirmação obrigatória por e-mail</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Benefícios dinâmicos */}
            <div className="mt-8 text-center">
              <Separator className="bg-slate-700 mb-6" />
              {authView === 'sign_up' ? (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Vantagens de ter uma conta
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span>Seus dados seguros e protegidos</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <span>Acesso instantâneo aos serviços</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-green-400" />
                      </div>
                      <span>Suporte personalizado e prioritário</span>
                    </div>
                  </div>
                </>
              ) : authView === 'forgotten_password' ? (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recuperação segura
                  </h3>
                  <div className="text-gray-300 space-y-2">
                    <p>• Enviaremos um link seguro para seu e-mail</p>
                    <p>• O link expira em 1 hora por segurança</p>
                    <p>• Você poderá criar uma nova senha</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Por que fazer login?
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span>Acompanhe seus projetos em tempo real</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-purple-400" />
                      </div>
                      <span>Receba atualizações por e-mail</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-green-400" />
                      </div>
                      <span>Acesso rápido a novos serviços</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}