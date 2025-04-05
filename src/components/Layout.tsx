import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wallet, LineChart, PiggyBank, 
  ArrowUpRight, Calendar, BarChart3, LogOut, Settings,
  Menu, X, User, ChevronDown, Moon, Sun
} from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { signOut, planner } = useAuth();
  const { currentClient } = useClient();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Verificar qual é a rota atual para destacar o item do menu
  const pathname = window.location.pathname;
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const isHome = pathname === '/';

  const navItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      to: '/', 
      active: isHome 
    },
    { 
      icon: <Users size={20} />, 
      label: 'Clientes', 
      to: '/clients', 
      active: isActive('/client') 
    },
    { 
      icon: <Wallet size={20} />, 
      label: 'Orçamento', 
      to: currentClient ? `/budget/${currentClient.id}` : '/budget', 
      active: isActive('/budget') 
    },
    { 
      icon: <LineChart size={20} />, 
      label: 'Fluxo de Caixa', 
      to: currentClient ? `/cash-flow/${currentClient.id}` : '/cash-flow', 
      active: isActive('/cash-flow') 
    },
    { 
      icon: <ArrowUpRight size={20} />, 
      label: 'Investimentos', 
      to: currentClient ? `/investments/${currentClient.id}` : '/investments', 
      active: isActive('/investments') 
    },
    { 
      icon: <Calendar size={20} />, 
      label: 'Aposentadoria', 
      to: currentClient ? `/retirement/${currentClient.id}` : '/retirement', 
      active: isActive('/retirement') 
    },
    { 
      icon: <PiggyBank size={20} />, 
      label: 'Fundo de Emergência', 
      to: currentClient ? `/emergency-fund/${currentClient.id}` : '/emergency-fund', 
      active: isActive('/emergency-fund') 
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Relatórios', 
      to: currentClient ? `/reports/${currentClient.id}` : '/reports', 
      active: isActive('/reports') 
    }
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-md p-1">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-lg font-bold text-primary">Plan Forge</h1>
        </div>
      </div>

      <div className="px-2 mt-4 flex-1 overflow-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={item.active}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        {currentClient && (
          <div className="mb-4 p-3 bg-primary/5 rounded-md flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full h-9 w-9 flex items-center justify-center">
              {currentClient.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{currentClient.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentClient.email}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar em desktop */}
      <div className="hidden md:block w-64 border-r shrink-0">
        {sidebar}
      </div>

      {/* Sidebar em mobile (offcanvas) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          {sidebar}
        </SheetContent>
      </Sheet>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header para mobile */}
        <header className="border-b px-4 py-3 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-3">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <h1 className="font-semibold text-lg text-primary">Plan Forge</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="bg-primary/10 text-primary rounded-full h-7 w-7 flex items-center justify-center">
                  {planner?.name?.charAt(0) || "U"}
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <p className="font-medium">{planner?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">{planner?.email || ""}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button className="w-full flex items-center gap-2 cursor-pointer" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button className="w-full flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};