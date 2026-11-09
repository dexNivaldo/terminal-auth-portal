import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

import { Alert } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { ThemeToggle } from './components/theme-toggle';
import { Google } from './icons/google';
import { authWithGoogle } from './services/auth.service';

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authWithGoogle();
      navigate('/');
    } catch {
      setError('Could not start Google sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Card className="p-6 sm:p-7">
          <div className="flex flex-col items-center text-center">
            <img src="/favicon.svg" alt="" className="size-10" />
            <h1 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Hatch
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Terminal Auth Portal
            </p>
          </div>

          <h2 className="mt-7 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Use your company account to continue.
          </p>

          <Button
            className="mt-5 w-full"
            onClick={signInWithGoogle}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Google />}
            {isLoading ? 'Signing in…' : 'Continue with Google'}
          </Button>

          {error && <Alert variant="error" className="mt-4">{error}</Alert>}

          <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Authentication is managed by your organization.
          </p>
        </Card>

        <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Hatch · Internal tool
        </p>
      </div>
    </div>
  );
};

export default Login;
