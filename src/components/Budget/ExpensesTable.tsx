import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import type { Expense } from '@/lib/types';

interface ExpensesTableProps {
  expenses: Expense[];
  title: string;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses, title }) => {
  // Calcular o total das despesas
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular a porcentagem de cada despesa em relação ao total
  const expensesWithPercentage = expenses.map(expense => ({
    ...expense,
    percentage: expense.percentage || Math.round((expense.amount / totalAmount) * 100)
  }));

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>% do Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesWithPercentage.map((expense, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>R$ {expense.amount.toLocaleString('pt-BR')}</TableCell>
                <TableCell>{expense.percentage}%</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="font-bold">R$ {totalAmount.toLocaleString('pt-BR')}</TableCell>
              <TableCell>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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
