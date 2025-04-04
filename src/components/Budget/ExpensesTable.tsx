
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Expense } from '@/lib/types';

interface ExpensesTableProps {
  expenses: Expense[];
  title: string;
}

export function ExpensesTable({ expenses, title }: ExpensesTableProps) {
  // Ordenar despesas por valor (do maior para o menor)
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>% da Renda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>R$ {expense.amount.toLocaleString('pt-BR')}</TableCell>
                <TableCell>{expense.percentage}%</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                Nenhuma despesa registrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
