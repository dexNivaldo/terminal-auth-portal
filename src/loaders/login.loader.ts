import { redirect } from "react-router"
import { getUser } from "../services/auth.service"

export default async function () {
   const usr = await getUser()
  
   if (usr) {
        return redirect('/')
    }

    return null
  }