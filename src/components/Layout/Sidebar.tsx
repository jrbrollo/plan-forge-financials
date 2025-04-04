
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  LineChart, 
  LifeBuoy,
  User
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
  
  return (
    <div className="h-screen w-64 bg-finance-darkblue text-white flex flex-col">
      <div className="p-4 font-semibold text-lg border-b border-finance-navy">
        <h1 className="text-xl">Plan Forge</h1>
        <p className="text-sm text-gray-400">Financial Planning</p>
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
            icon={<User size={18} />} 
            label="Clientes" 
            active={path === '/clients'} 
          />
          <SidebarItem 
            to="/cash-flow" 
            icon={<DollarSign size={18} />} 
            label="Cash Flow" 
            active={path === '/cash-flow'} 
          />
          <SidebarItem 
            to="/budget" 
            icon={<TrendingUp size={18} />} 
            label="Budget" 
            active={path === '/budget'} 
          />
          <SidebarItem 
            to="/investments" 
            icon={<LineChart size={18} />} 
            label="Investments" 
            active={path === '/investments'} 
          />
          <SidebarItem 
            to="/emergency-fund" 
            icon={<Shield size={18} />} 
            label="Emergency Fund" 
            active={path === '/emergency-fund'} 
          />
          <SidebarItem 
            to="/income-protection" 
            icon={<LifeBuoy size={18} />} 
            label="Income Protection" 
            active={path === '/income-protection'} 
          />
          <SidebarItem 
            to="/retirement" 
            icon={<LineChart size={18} />} 
            label="Retirement" 
            active={path === '/retirement'} 
          />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-finance-navy">
        <div className="text-sm text-gray-400">
          <p>Current Client:</p>
          <p className="font-semibold text-white">João Silva</p>
        </div>
      </div>
    </div>
  );
}
