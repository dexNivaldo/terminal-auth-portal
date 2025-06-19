import { supabase } from "./supabase"

export const getTerminals = async () => {
    const query = supabase.from('terminals').select('id,name,code')
    const { data, error } = await query
    
    if(error) {
        return []
    }

    return data
}