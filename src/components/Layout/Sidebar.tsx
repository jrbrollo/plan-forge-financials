
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useClient } from '@/context/ClientContext';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  LineChart, 
  LifeBuoy,
  User,
  Users,
  Target,
  Settings
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-finance-navy hover:text-white",
          active ? "bg-finance-navy text-white" : "text-gray-200"
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { clientId } = useParams();
  const { currentClient } = useClient();
  
  // Função para criar links com ou sem clientId
  const createLink = (basePath: string) => {
    return clientId ? `${basePath}/${clientId}` : basePath;
  };
  
  return (
    <div className="h-screen w-64 bg-finance-darkblue text-white flex flex-col">
      <div className="p-4 font-semibold text-lg border-b border-finance-navy">
        <h1 className="text-xl">Plan Forge</h1>
        <p className="text-sm text-gray-400">Planejamento Financeiro</p>
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          <SidebarItem 
            to="/" 
            icon={<Home size={18} />} 
            label="Dashboard" 
            active={path === '/'} 
          />
          <SidebarItem 
            to="/clients" 
            icon={<Users size={18} />} 
            label="Clientes" 
            active={path === '/clients' || path.startsWith('/clients/')} 
          />
          <SidebarItem 
            to={createLink("/cash-flow")}
            icon={<DollarSign size={18} />} 
            label="Fluxo de Caixa" 
            active={path === '/cash-flow' || path.startsWith('/cash-flow/')} 
          />
          <SidebarItem 
            to={createLink("/budget")}
            icon={<TrendingUp size={18} />} 
            label="Orçamento" 
            active={path === '/budget' || path.startsWith('/budget/')} 
          />
          <SidebarItem 
            to={createLink("/investments")}
            icon={<LineChart size={18} />} 
            label="Investimentos" 
            active={path === '/investments' || path.startsWith('/investments/')} 
          />
          <SidebarItem 
            to={createLink("/emergency-fund")}
            icon={<Shield size={18} />} 
            label="Reserva de Emergência" 
            active={path === '/emergency-fund' || path.startsWith('/emergency-fund/')} 
          />
          <SidebarItem 
            to={createLink("/income-protection")}
            icon={<LifeBuoy size={18} />} 
            label="Proteção de Renda" 
            active={path === '/income-protection' || path.startsWith('/income-protection/')} 
          />
          <SidebarItem 
            to={createLink("/retirement")}
            icon={<Target size={18} />} 
            label="Aposentadoria" 
            active={path === '/retirement' || path.startsWith('/retirement/')} 
          />
          <div className="pt-4 mt-4 border-t border-finance-navy">
            <SidebarItem 
              to="/admin" 
              icon={<Settings size={18} />} 
              label="Administração" 
              active={path === '/admin'} 
            />
          </div>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-finance-navy">
        <div className="text-sm text-gray-400">
          <p>Cliente Atual:</p>
          <p className="font-semibold text-white">
            {currentClient ? currentClient.name : "Nenhum selecionado"}
          </p>
        </div>
      </div>
    </div>
  );
}
