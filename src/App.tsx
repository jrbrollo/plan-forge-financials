import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider } from "@/context/ClientContext";
import { getClients, addTestClient } from "@/services/clientService";

// Import pages
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import CashFlow from "./pages/CashFlow";
import EmergencyFund from "./pages/EmergencyFund";
import IncomeProtection from "./pages/IncomeProtection";
import Investments from "./pages/Investments";
import Retirement from "./pages/Retirement";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";

const App = () => {
  // Create a new QueryClient for React Query inside the component
  const queryClient = new QueryClient();
  
  // Efeito para inicializar dados na primeira execução
  useEffect(() => {
    // RESTAURAR OS DADOS: Remover a marcação de inicialização para forçar a recriação do cliente
    localStorage.removeItem('plan_forge_initialized');
    
    // Verifica se a aplicação já foi inicializada
    const appInitialized = localStorage.getItem('plan_forge_initialized');
    
    // Se não estiver inicializada, verificar clientes
    if (!appInitialized) {
      const clients = getClients();
      
      // Remover clientes existentes e adicionar o cliente de teste novamente
      localStorage.removeItem('clients');
      console.log('Clientes atuais removidos para restaurar dados');
      
      // Adicionar cliente teste com dados completos
      addTestClient();
      console.log('Cliente de teste restaurado com dados completos');
      
      // Marca a aplicação como inicializada
      localStorage.setItem('plan_forge_initialized', 'true');
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<ClientDetails />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/budget/:clientId" element={<Budget />} />
              <Route path="/cash-flow" element={<CashFlow />} />
              <Route path="/cash-flow/:clientId" element={<CashFlow />} />
              <Route path="/emergency-fund" element={<EmergencyFund />} />
              <Route path="/emergency-fund/:clientId" element={<EmergencyFund />} />
              <Route path="/income-protection" element={<IncomeProtection />} />
              <Route path="/income-protection/:clientId" element={<IncomeProtection />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/investments/:clientId" element={<Investments />} />
              <Route path="/retirement" element={<Retirement />} />
              <Route path="/retirement/:clientId" element={<Retirement />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/dashboard/:clientId" element={<ClientDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ClientProvider>
    </QueryClientProvider>
  );
};

export default App;
