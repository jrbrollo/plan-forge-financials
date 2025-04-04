
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from 'lucide-react';
import { BudgetDashboard } from '@/components/Dashboard/BudgetDashboard';
import { ExpensesTable } from '@/components/Budget/ExpensesTable';
import { ClientOverview } from '@/components/Dashboard/ClientOverview';
import { useClient } from '@/context/ClientContext';
import { getClientById } from '@/services/clientService';
import type { Expense, Income } from '@/lib/types';

// Dados de exemplo para o caso de não ter dados específicos do cliente
const defaultIncomes: Income[] = [
  { source: "Salário", amount: 5000, frequency: "monthly", percentage: 100 }
];

const defaultExpenses: Expense[] = [
  { category: "fixed", description: "Aluguel", amount: 1200, percentage: 24 },
  { category: "fixed", description: "Contas (água, luz, internet)", amount: 500, percentage: 10 },
  { category: "fixed", description: "Plano de saúde", amount: 300, percentage: 6 },
  { category: "variable", description: "Alimentação", amount: 800, percentage: 16 },
  { category: "variable", description: "Transporte", amount: 400, percentage: 8 },
  { category: "variable", description: "Lazer", amount: 600, percentage: 12 }
];

const Budget = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { currentClient, setCurrentClient } = useClient();
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>(defaultIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);

  useEffect(() => {
    const loadClientData = async () => {
      if (clientId) {
        const client = getClientById(clientId);
        if (client) {
          setCurrentClient(client);
          
          // Aqui você carregaria os dados de orçamento específicos deste cliente
          // Por enquanto usamos os dados padrão
          setIncomes(defaultIncomes);
          setExpenses(defaultExpenses);
        }
      }
      setLoading(false);
    };
    
    loadClientData();
  }, [clientId, setCurrentClient]);

  const fixedExpenses = expenses.filter(expense => expense.category === "fixed");
  const variableExpenses = expenses.filter(expense => expense.category === "variable");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orçamento</h1>
            <p className="text-gray-500">Análise detalhada de receitas e despesas</p>
          </div>
          
          {clientId && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/clients/${clientId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Cliente
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados do orçamento...</p>
          </div>
        ) : (
          <>
            {currentClient && (
              <div className="mb-6">
                <ClientOverview client={currentClient} />
              </div>
            )}

            <BudgetDashboard incomes={incomes} expenses={expenses} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Receitas</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fonte</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>% do Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomes.map((income, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{income.source}</TableCell>
                          <TableCell>R$ {income.amount.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>{income.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div>
                <ExpensesTable 
                  expenses={fixedExpenses} 
                  title="Despesas Fixas" 
                />
                
                <ExpensesTable 
                  expenses={variableExpenses} 
                  title="Despesas Variáveis" 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componentes auxiliares para a tabela
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 text-xs font-medium text-gray-500">{children}</thead>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b">{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="py-3 px-4 text-left">{children}</th>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200 text-sm">{children}</tbody>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`py-3 px-4 ${className}`}>{children}</td>
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">{children}</table>
  </div>
);

export default Budget;
