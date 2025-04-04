
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import CashFlow from "./pages/CashFlow";
import EmergencyFund from "./pages/EmergencyFund";
import IncomeProtection from "./pages/IncomeProtection";
import Investments from "./pages/Investments";
import Retirement from "./pages/Retirement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/emergency-fund" element={<EmergencyFund />} />
          <Route path="/income-protection" element={<IncomeProtection />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/retirement" element={<Retirement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
