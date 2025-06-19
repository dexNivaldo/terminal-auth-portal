import { AuthEntry, AuthEntryInput } from "../types/auth-entry"
import { supabase } from "./supabase"

const TABLE = 'auth-entries'

export const getAuthEntries = async () => {
    const query = supabase.from(TABLE)
    .select<string, AuthEntry>('id,isProd,role,patente,terminal:terminals(id,code)')
    .order('created_at', { ascending: false })

    const { data: entries, error } = await query
    if (error) {
        console.log(error)
        return []
    }

    return entries
}

export const createAuthEntry = async (data: Partial<AuthEntryInput>) => {
    const { data: { user }, error: errorUser } = await supabase.auth.getUser();
    
    if (errorUser) {
        return await Promise.reject(errorUser)
    }

    const { error } = await supabase.from(TABLE).insert(
        {...data, user: user?.id}
    )

    if (error) {
        return await Promise.reject(error)
    }

    return await Promise.resolve()
}

export const deleteEntry = async (id: number) => {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) {
        return await Promise.reject(error)
    }

    return await Promise.resolve()
}