import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Button, 
  Label, 
  Input, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@raga/ui';
import type { Role } from '@/types/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // In a real app, you'd fetch the user's role from Firestore here.
      // Simulating a fetched user role based on the username for demonstration
      let role: Role = 'DOCTOR';
      if (email.includes('admin')) role = 'ADMIN';
      if (email.includes('nurse')) role = 'NURSE';

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName,
        role: role,
      });
      
      navigate(from, { replace: true });

    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 font-geist">
      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center pb-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="size-10 text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-center">Healthcare Portal</CardTitle>
          <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Sign in to access your secure patient dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg animate-in fade-in slide-in-from-top-1 border border-red-200 dark:border-red-900/30">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" 
                type="email" 
                placeholder="doctor@hospital.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-11"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="size-4 accent-primary" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Remember me</span>
              </label>
              <Button variant="link" className="px-0 h-auto font-normal text-sm" type="button">Forgot password?</Button>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="absolute bottom-8 text-center text-sm text-zinc-400">
        <p>&copy; 2026 Raga AI. Built for clinical excellence.</p>
      </div>
    </div>
  );
}
