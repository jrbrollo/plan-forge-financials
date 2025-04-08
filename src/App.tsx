
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LoaderFull } from '@/components/LoaderFull';
import { ClientProvider } from '@/context/ClientContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Clients = lazy(() => import('@/pages/Clients'));
const ClientDetails = lazy(() => import('@/pages/ClientDetails'));
const AddClient = lazy(() => import('@/pages/AddClient'));
const Budget = lazy(() => import('@/pages/Budget'));
const CashFlow = lazy(() => import('@/pages/CashFlow'));
const Investments = lazy(() => import('@/pages/Investments'));
const Retirement = lazy(() => import('@/pages/Retirement'));
const EmergencyFund = lazy(() => import('@/pages/EmergencyFund'));
const Reports = lazy(() => import('@/pages/Reports'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));

// Componente para verificar autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoaderFull 
      message="Verificando autenticação..." 
      debug={`Estado atual: isLoading=${isLoading}, user=${user ? 'logado' : 'não logado'}`} 
    />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Simplificando o UnauthenticatedRoute para evitar problemas
const UnauthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // Mostrar o loader apenas por um breve momento para evitar loops
  if (isLoading) {
    return <LoaderFull 
      message="Preparando..." 
      debug={`Rota não autenticada: isLoading=${isLoading}, user=${user ? 'logado' : 'não logado'}`} 
    />;
  }
  
  if (user) {
    return <Navigate to="/clients" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="plan-forge-theme">
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoaderFull message="Carregando aplicação..." />}>
            <Routes>
              {/* Rotas públicas de autenticação */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Dashboard />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/clients" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Clients />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/client/:id" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <ClientDetails />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/add-client" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <AddClient />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/budget/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Budget />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/cash-flow/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <CashFlow />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/investments/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Investments />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/retirement/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Retirement />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/emergency-fund/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <EmergencyFund />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/reports/:clientId?" element={
                <ProtectedRoute>
                  <ClientProvider>
                    <Reports />
                  </ClientProvider>
                </ProtectedRoute>
              } />
              
              {/* Rota de fallback para redirecionar para login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
