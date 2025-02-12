import { supabase } from "./supabase";

export const authTerminal = (terminal: string, patente: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/Auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: import.meta.env.VITE_USER_NAME,
          email: import.meta.env.VITE_USER_EMAIL,
          patents: [
            {
                "type": "BROKER",
                "value": "1669"
            },
            {
                "type": "BROKER",
                "value": "0500"
            },
            {
                "type": "BROKER",
                "value": "1333"
            }
        ],
          selection: patente,
          user: import.meta.env.VITE_USER_EMAIL,
          key: import.meta.env.VITE_AUTH_KEY,
          terminalCode: terminal
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

export async function getUser(){
    const { data: { user } } = await supabase.auth.getUser()

    return user
}
