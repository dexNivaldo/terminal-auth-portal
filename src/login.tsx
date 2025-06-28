import { FunctionComponent } from 'react'
import Backgroud from './background'
import { Google } from './icons/google'
import { authWithGoogle } from './services/auth.service'

const Login: FunctionComponent = () => {

    const signInWithGoogle = async () => {
        try {
            const data = authWithGoogle()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
      }
    return (
        <>
            <Backgroud />
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex overflow-hidden items-center">
                <Backgroud />

                <div className="max-w-md mx-auto">
                    <div className="glass-effect rounded-2xl shadow-2xl p-8 space-y-4">
                        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
                            Terminal Auth Portal
                        </h2>
                        <button
                            type="button"
                            className="flex items-center gap-3 w-full justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={signInWithGoogle}
                        >
                            <Google />
                            Login with Google
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
