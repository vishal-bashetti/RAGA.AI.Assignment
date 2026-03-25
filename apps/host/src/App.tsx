import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import type { Role } from '@/types/auth';
import { Button } from '@raga/ui';

function Dashboard() {
  const { user, logout } = useAuthStore();
  
  return (
    <div className="p-8 font-geist">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Healthcare Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{user?.role}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>Logout</Button>
          </div>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 h-48 flex items-center justify-center">
            <p className="text-zinc-500">Clinical Data Summary</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 h-48 flex items-center justify-center">
            <p className="text-zinc-500">Patient Records</p>
          </div>
          {user?.role === 'ADMIN' && (
            <div className="bg-primary/5 p-6 rounded-2xl shadow-sm border border-primary/20 md:col-span-2">
              <h2 className="text-lg font-bold text-primary mb-2">Admin Panel</h2>
              <p className="text-zinc-600 dark:text-zinc-400">System-wide settings and audit logs are accessible only to you.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    // Phase 2: Listening for Auth State Changes (Firebase Persistence)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Simulating role fetching (usually from Firestore)
        let role: Role = 'DOCTOR';
        if (firebaseUser.email?.includes('admin')) role = 'ADMIN';
        if (firebaseUser.email?.includes('nurse')) role = 'NURSE';

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          role: role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-geist">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 font-medium">Initializing Healthcare Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Example of Role-Restricted Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="p-8">Admin Only Content</div>
            </ProtectedRoute>
          } 
        />

        <Route path="/unauthorized" element={
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-4xl font-bold text-red-600">403 Unauthorized</h1>
            <p className="mt-4 text-zinc-600">You do not have the required permissions to access this page.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
