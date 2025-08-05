"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Camera, 
  Save, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  Shield,
  Key,
  Smartphone,
  ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  avatar_url: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    avatar_url: ''
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    avatar_url: ''
  });
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    // Verificar se há mudanças
    const changed = JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [profileData, originalData]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const profile = data || {
        full_name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        company: '',
        avatar_url: user?.user_metadata?.avatar_url || ''
      };

      setProfileData(profile);
      setOriginalData(profile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar dados do perfil');
    } finally {
      setLoadingData(false);
    }
  };

  // Máscara para telefone brasileiro
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara baseada no tamanho
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Validar telefone brasileiro
  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length === 0) {
      return ''; // Vazio é válido
    }
    
    if (numbers.length === 10) {
      // Telefone fixo: (11) 1234-5678
      const ddd = numbers.slice(0, 2);
      const firstDigit = numbers.slice(2, 3);
      
      if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
        return 'DDD inválido';
      }
      
      if (firstDigit === '9') {
        return 'Telefone fixo não pode começar com 9';
      }
      
      return '';
    } else if (numbers.length === 11) {
      // Celular: (11) 91234-5678
      const ddd = numbers.slice(0, 2);
      const firstDigit = numbers.slice(2, 3);
      
      if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
        return 'DDD inválido';
      }
      
      if (firstDigit !== '9') {
        return 'Celular deve começar com 9';
      }
      
      return '';
    } else {
      return 'Telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)';
    }
  };

  // Validar nome completo
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return 'Nome é obrigatório';
    }
    
    const parts = name.trim().split(' ').filter(part => part.length > 0);
    
    if (parts.length < 2) {
      return 'Digite nome e sobrenome';
    }
    
    // Verificar se cada parte tem pelo menos 2 caracteres
    for (const part of parts) {
      if (part.length < 2) {
        return 'Cada parte do nome deve ter pelo menos 2 caracteres';
      }
    }
    
    return '';
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (field === 'phone') {
      const formatted = formatPhone(value);
      setProfileData(prev => ({ ...prev, [field]: formatted }));
      setPhoneError(validatePhone(formatted));
    } else if (field === 'full_name') {
      setProfileData(prev => ({ ...prev, [field]: value }));
      setNameError(validateFullName(value));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Função para redimensionar imagem
  const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo aspect ratio
        let { width, height } = img;
        
        // Redimensionar para caber no quadrado mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Criar canvas quadrado
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        
        // Preencher com fundo branco
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, maxWidth, maxHeight);
        
        // Centralizar imagem no canvas
        const x = (maxWidth - width) / 2;
        const y = (maxHeight - height) / 2;
        
        ctx!.drawImage(img, x, y, width, height);
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG ou GIF.');
      return;
    }

    // Validar tamanho (5MB antes da compressão)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setUploadingPhoto(true);
    setImageLoading(true);

    try {
      // Redimensionar e otimizar imagem
      const resizedFile = await resizeImage(file, 400, 400, 0.8);
      
      // Criar preview local
      const previewUrl = URL.createObjectURL(resizedFile);
      setPreviewUrl(previewUrl);
      
      // Gerar nome único e simples para o arquivo
      const fileExt = 'jpg'; // Sempre salvar como JPG após otimização
      const fileName = `avatar-${user?.id}-${Date.now()}.${fileExt}`;

      console.log('Iniciando upload do arquivo otimizado:', fileName);

      // Upload para Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso:', data);

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', publicUrl);

      // Atualizar estado local
      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Limpar preview temporário
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      
      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      toast.error(`Erro ao fazer upload da foto: ${error.message || 'Erro desconhecido'}`);
      
      // Limpar preview em caso de erro
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    } finally {
      setUploadingPhoto(false);
      setImageLoading(false);
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    // Validações antes de salvar
    const phoneValidation = validatePhone(profileData.phone);
    const nameValidation = validateFullName(profileData.full_name);
    
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      toast.error('Corrija os erros antes de salvar');
      return;
    }
    
    if (nameValidation) {
      setNameError(nameValidation);
      toast.error('Corrija os erros antes de salvar');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setOriginalData(profileData);
      setPhoneError('');
      setNameError('');
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setPhoneError('');
    setNameError('');
  };

  const getUserInitials = () => {
    const name = profileData.full_name || user?.email || 'U';
    if (name.includes(' ')) {
      const parts = name.split(' ');
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleChangePassword = () => {
    toast.info('Funcionalidade em desenvolvimento. Em breve você poderá alterar sua senha.');
  };

  const handleSetupTwoFactor = () => {
    setTwoFactorOpen(true);
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
        <div className="container mx-auto px-4 max-w-4xl">
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
                <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
                <p className="text-gray-300">Gerencie suas informações pessoais</p>
              </div>
            </div>

            {hasChanges && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  Você tem alterações não salvas. Lembre-se de salvar antes de sair.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar e Informações Básicas */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center">
                    <User className="w-5 h-5 mr-2 text-cyan-400" />
                    Foto do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {/* Avatar Otimizado */}
                  <div className="relative mx-auto w-32 h-32">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-slate-800/80 rounded-full flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      </div>
                    )}
                    
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                      {(previewUrl || profileData.avatar_url) ? (
                        <img
                          src={previewUrl || profileData.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover object-center"
                          style={{
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                          onLoad={() => setImageLoading(false)}
                          onError={() => {
                            setImageLoading(false);
                            console.error('Erro ao carregar imagem');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {getUserInitials()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Input file oculto */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    
                    <Button
                      onClick={handlePhotoClick}
                      disabled={uploadingPhoto}
                      variant="outline"
                      className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      {uploadingPhoto ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400 mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Alterar Foto
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400">
                      JPG, PNG ou GIF. Máximo 5MB.<br />
                      A imagem será otimizada automaticamente.
                    </p>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="text-left space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-300">{user?.email}</span>
                      <CheckCircle className="w-4 h-4 ml-2 text-green-400" title="E-mail verificado" />
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-300">
                        Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Edição */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-cyan-400" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nome Completo */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-300">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className={`bg-slate-800 border-slate-700 text-white focus:border-cyan-500 ${
                        nameError ? 'border-red-500' : ''
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                    {nameError && (
                      <p className="text-red-400 text-sm mt-1">{nameError}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Digite nome e sobrenome separados por espaço
                    </p>
                  </div>

                  {/* E-mail (readonly) */}
                  <div>
                    <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      readOnly
                      className="bg-slate-800/50 border-slate-700 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      O e-mail não pode ser alterado. Entre em contato com o suporte se necessário.
                    </p>
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`bg-slate-800 border-slate-700 text-white focus:border-cyan-500 ${
                        phoneError ? 'border-red-500' : ''
                      }`}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {phoneError && (
                      <p className="text-red-400 text-sm mt-1">{phoneError}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Digite o número completo com DDD. Fixo: (11) 1234-5678 ou Celular: (11) 91234-5678
                    </p>
                  </div>

                  {/* Empresa */}
                  <div>
                    <Label htmlFor="company" className="text-gray-300">Empresa</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving || !hasChanges || !!phoneError || !!nameError}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                    
                    {hasChanges && (
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-800"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Seção de Segurança */}
              <Card className="bg-slate-900/50 border-slate-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Senha</p>
                      <p className="text-sm text-gray-400">Altere sua senha de acesso</p>
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Autenticação de Dois Fatores</p>
                      <p className="text-sm text-gray-400">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button
                      onClick={handleSetupTwoFactor}
                      variant="outline"
                      className="border-slate-600 text-gray-300 hover:bg-slate-800"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de 2FA */}
      <Dialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Autenticação de Dois Fatores
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-6">
              <Smartphone className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
              <p className="text-gray-300 mb-4">
                A autenticação de dois fatores estará disponível em breve para aumentar a segurança da sua conta.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4 text-left">
                <h4 className="font-medium mb-2">O que você poderá fazer:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Configurar autenticação via SMS</li>
                  <li>• Usar aplicativos como Google Authenticator</li>
                  <li>• Códigos de backup para emergência</li>
                  <li>• Maior proteção contra acessos não autorizados</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-en">
              <Button
                onClick={() => setTwoFactorOpen(false)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}