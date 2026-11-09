import { redirect } from "react-router"
import { getUser } from "../services/auth.service"

export default async function () {
   const user = await getUser()

   if (!user) {
        return redirect('/login')
    }

    return { user }
  }
