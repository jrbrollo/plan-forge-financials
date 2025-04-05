import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, Wallet, LineChart, PiggyBank, ArrowUpRight, 
  Calendar, GanttChartSquare, BarChart3, UserPlus 
} from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { useAuth } from '@/context/AuthContext';
import { getClientsByPlannerId } from '@/services/clientSupabaseService';
import { Client } from '@/lib/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { planner } = useAuth();
  const { setCurrentClient } = useClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      if (planner?.id) {
        try {
          const clientsData = await getClientsByPlannerId(planner.id);
          setClients(clientsData);
        } catch (error) {
          console.error('Erro ao carregar clientes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadClients();
  }, [planner?.id]);

  const handleClientSelect = (client: Client) => {
    setCurrentClient(client);
    navigate(`/client/${client.id}`);
  };

  const navigateToModule = (path: string) => {
    navigate(path);
  };

  const moduleCards = [
    { 
      title: 'Orçamento', 
      description: 'Gestão de receitas e despesas',
      icon: <Wallet className="h-12 w-12 text-primary" />,
      path: '/budget'
    },
    { 
      title: 'Fluxo de Caixa', 
      description: 'Análise de entrada e saída',
      icon: <LineChart className="h-12 w-12 text-primary" />,
      path: '/cash-flow'
    },
    { 
      title: 'Investimentos', 
      description: 'Alocação e projeções',
      icon: <ArrowUpRight className="h-12 w-12 text-primary" />,
      path: '/investments'
    },
    { 
      title: 'Aposentadoria', 
      description: 'Planejamento de longo prazo',
      icon: <Calendar className="h-12 w-12 text-primary" />,
      path: '/retirement'
    },
    { 
      title: 'Fundo de Emergência', 
      description: 'Reserva de segurança',
      icon: <PiggyBank className="h-12 w-12 text-primary" />,
      path: '/emergency-fund'
    },
    { 
      title: 'Relatórios', 
      description: 'Visão consolidada',
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      path: '/reports'
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/add-client')} 
            className="gap-2"
          >
            <UserPlus size={16} />
            Adicionar Cliente
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex flex-row items-center justify-between pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                <h2 className="text-3xl font-bold">{clients.length}</h2>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center justify-between pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planos Ativos</p>
                <h2 className="text-3xl font-bold">{clients.filter(c => c.isActive).length}</h2>
              </div>
              <GanttChartSquare className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center justify-between pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planejador</p>
                <h2 className="text-xl font-bold line-clamp-1">{planner?.name || "Usuário"}</h2>
              </div>
              <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center">
                {planner?.name?.charAt(0) || "U"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos */}
        <h2 className="text-2xl font-semibold mt-2">Módulos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateToModule(card.path)}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  {card.icon}
                  <div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clientes Recentes */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Selecione um cliente para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4 text-muted-foreground">Carregando clientes...</p>
              ) : clients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Nenhum cliente cadastrado ainda</p>
                  <Button onClick={() => navigate('/add-client')}>
                    Adicionar Primeiro Cliente
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.slice(0, 6).map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleClientSelect(client)}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 text-primary rounded-full h-12 w-12 flex items-center justify-center">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-1">{client.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{client.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {clients.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => navigate('/clients')}>
                    Ver Todos os Clientes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 