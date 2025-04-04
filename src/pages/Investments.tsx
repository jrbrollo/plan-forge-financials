
import React, { useState } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { InvestmentForm } from "@/components/Forms/InvestmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/lib/types";
import { format } from "date-fns";
import { Plus, PieChart, Edit, Trash } from "lucide-react";
import { PieChart as PieChartComponent, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Sample investments
const sampleInvestments: Investment[] = [
  {
    name: "Reserva de emergência",
    type: "emergency_fund",
    initialValue: 10000,
    currentValue: 10000,
    annualReturn: 14.15,
    investmentDate: new Date("2025-03-23")
  },
  {
    name: "Previdência",
    type: "retirement",
    initialValue: 50000,
    currentValue: 55000,
    annualReturn: 10,
    investmentDate: new Date("2023-01-15")
  },
  {
    name: "Tesouro Direto",
    type: "fixed_income",
    initialValue: 20000,
    currentValue: 21500,
    annualReturn: 7.5,
    investmentDate: new Date("2024-01-10")
  }
];

// Map investment type to a readable name in Portuguese
const getTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    fixed_income: "Renda Fixa",
    variable_income: "Renda Variável",
    real_estate: "Fundos Imobiliários",
    emergency_fund: "Reserva de Emergência",
    retirement: "Previdência"
  };
  
  return typeMap[type] || type;
};

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments);
  const [showForm, setShowForm] = useState(false);
  
  // Colors for the chart
  const COLORS = ['#0A1C45', '#2B4C91', '#6C81AC', '#38A169', '#F6AD55'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Calculate total investment value
  const totalInvestment = investments.reduce((total, investment) => total + investment.currentValue, 0);
  
  // Prepare data for chart by investment type
  const chartData = investments.reduce((acc, investment) => {
    const existingType = acc.find(item => item.name === getTypeLabel(investment.type));
    
    if (existingType) {
      existingType.value += investment.currentValue;
    } else {
      acc.push({
        name: getTypeLabel(investment.type),
        value: investment.currentValue
      });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Handle save new investment
  const handleSaveInvestment = (investment: Investment) => {
    setInvestments([...investments, investment]);
    setShowForm(false);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-finance-navy">Investments</h1>
            <p className="text-gray-600">Manage and track all investments.</p>
          </div>
          
          <Button 
            className="bg-finance-blue hover:bg-finance-darkblue flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Add Investment
          </Button>
        </div>
        
        {showForm ? (
          <InvestmentForm 
            onSave={handleSaveInvestment}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-finance-navy">Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-finance-blue">{formatCurrency(totalInvestment)}</p>
                  <p className="text-sm text-gray-500">Across {investments.length} investments</p>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-finance-navy">Investment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Value']}
                        />
                        <Legend />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-finance-navy">Investment List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Investment</th>
                        <th>Type</th>
                        <th>Initial Value</th>
                        <th>Current Value</th>
                        <th>Return %</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment, index) => (
                        <tr key={index}>
                          <td>{investment.name}</td>
                          <td>{getTypeLabel(investment.type)}</td>
                          <td>{formatCurrency(investment.initialValue)}</td>
                          <td>{formatCurrency(investment.currentValue)}</td>
                          <td>{investment.annualReturn.toFixed(2)}%</td>
                          <td>{format(new Date(investment.investmentDate), 'dd/MM/yyyy')}</td>
                          <td>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Investments;
