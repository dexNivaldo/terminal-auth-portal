import { EntryRole } from "@/types/auth-entry";
import { supabase } from "./supabase";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()

  return user
}

const userTypeMap: Record<EntryRole, string> = {
  'AA': 'LINE',
  'CARRIER': 'CARRIER',
  'BROKER': 'BROKER'
}

export const authTerminal = async (terminal: string, patente: string, role: string) => {
  const user = await getUser()
  const settings = JSON.parse(localStorage.getItem('settings') || '{}')

  const baseUrl = settings.isProd ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_API_URL
  return fetch(`${baseUrl}/Auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: user?.user_metadata?.name,
      email: user?.email,
      app: 'TAS',
      userType: userTypeMap[role as keyof typeof userTypeMap] || 'LINE',
      patents: [],
      selection: patente,
      user: user?.email,
      key: settings.isProd ? import.meta.env.VITE_PROD_AUTH_KEY : import.meta.env.VITE_AUTH_KEY,
      terminalCode: terminal,
      carrierPatentId: ''
    }),
  });
}

export const authWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: import.meta.env.VITE_LOGIN_REDIRECT_URL
    }
  })

  if (error) {
    console.log(error)
    throw error
  }

  return data
}
