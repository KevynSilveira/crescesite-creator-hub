-- Criar tabela para dados da empresa
CREATE TABLE public.company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'CresceSite',
  description TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para serviços oferecidos
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  features TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para contatos/leads
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  service_interest TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para usuários admin
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para company_info (público pode ler, admin pode editar)
CREATE POLICY "Todos podem ver dados da empresa" 
ON public.company_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admin pode editar dados da empresa" 
ON public.company_info 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Políticas para serviços (público pode ler, admin pode editar)
CREATE POLICY "Todos podem ver serviços" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Admin pode gerenciar serviços" 
ON public.services 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Políticas para contatos (todos podem criar, admin pode ver/editar)
CREATE POLICY "Todos podem criar contatos" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin pode ver todos os contatos" 
ON public.contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admin pode editar contatos" 
ON public.contacts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Políticas para admin_users
CREATE POLICY "Admin pode ver outros admins" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admin pode gerenciar outros admins" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Inserir dados iniciais da empresa
INSERT INTO public.company_info (name, description, email, phone) VALUES (
  'CresceSite',
  'Criamos websites de alto desempenho que impulsionam seu negócio para o próximo nível',
  'contato@crescesite.com',
  '(11) 99999-9999'
);

-- Inserir serviços iniciais
INSERT INTO public.services (title, description, price, features, is_featured) VALUES 
(
  'Landing Page Profissional',
  'Página otimizada para conversão com design responsivo',
  899.00,
  ARRAY['Design Responsivo', 'SEO Otimizado', 'Formulário de Contato', 'Analytics Integrado'],
  true
),
(
  'Site Institucional',
  'Website completo para sua empresa com múltiplas páginas',
  1899.00,
  ARRAY['Até 5 Páginas', 'Design Customizado', 'CMS Integrado', 'Certificado SSL', 'Suporte 30 dias'],
  true
),
(
  'E-commerce Completo',
  'Loja virtual profissional pronta para vendas',
  3499.00,
  ARRAY['Catálogo de Produtos', 'Gateway de Pagamento', 'Painel Administrativo', 'Relatórios de Vendas', 'Suporte 90 dias'],
  true
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON public.company_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();