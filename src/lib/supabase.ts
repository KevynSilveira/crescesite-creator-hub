import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configurações de Auth
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configurar URL de confirmação
    flowType: 'pkce'
  }
})

// Função para verificar se usuário confirmou e-mail
export const checkEmailConfirmation = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user && !user.email_confirmed_at) {
    return {
      confirmed: false,
      message: 'Por favor, confirme seu e-mail antes de continuar.'
    }
  }
  
  return {
    confirmed: true,
    message: 'E-mail confirmado com sucesso!'
  }
}