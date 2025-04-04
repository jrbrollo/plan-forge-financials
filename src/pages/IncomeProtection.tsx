
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Protection } from '@/lib/types';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

// Sample protection data
const protections: Protection[] = [
  {
    type: "Seguro de Vida",
    provider: "Seguradora XYZ",
    coverageAmount: 500000,
    monthlyPremium: 120,
    expirationDate: new Date("2025-12-31")
  },
  {
    type: "Plano de Saúde",
    provider: "Saúde Total",
    coverageAmount: 0,
    monthlyPremium: 650,
    expirationDate: new Date("2026-03-15")
  }
];

const IncomeProtection = () => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Income Protection</h1>
          <p className="text-gray-600">Manage insurance and protection plans.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Protection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Monthly Premiums:</span>
                  <span className="font-medium">
                    {formatCurrency(protections.reduce((total, protection) => total + protection.monthlyPremium, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Coverage Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(protections.reduce((total, protection) => total + protection.coverageAmount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Active Policies:</span>
                  <span className="font-medium">{protections.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-finance-navy">Protection Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10">
                    {protections.some(p => p.type === "Seguro de Vida") ? 
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                        <Check size={18} />
                      </div> : 
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                        <X size={18} />
                      </div>
                    }
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Seguro de Vida</h3>
                    <p className="text-sm text-gray-500">Coverage for unexpected loss of life</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10">
                    {protections.some(p => p.type === "Plano de Saúde") ? 
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                        <Check size={18} />
                      </div> : 
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                        <X size={18} />
                      </div>
                    }
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Plano de Saúde</h3>
                    <p className="text-sm text-gray-500">Coverage for medical expenses</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10">
                    {protections.some(p => p.type === "Seguro Residencial") ? 
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                        <Check size={18} />
                      </div> : 
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                        <X size={18} />
                      </div>
                    }
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Seguro Residencial</h3>
                    <p className="text-sm text-gray-500">Coverage for home and belongings</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10">
                    {protections.some(p => p.type === "Seguro de Incapacidade") ? 
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-finance-green">
                        <Check size={18} />
                      </div> : 
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-finance-red">
                        <X size={18} />
                      </div>
                    }
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Seguro de Incapacidade</h3>
                    <p className="text-sm text-gray-500">Coverage for disability or inability to work</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-finance-navy">Current Protection Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>Coverage Amount</th>
                  <th>Monthly Premium</th>
                  <th>Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {protections.map((protection, index) => (
                  <tr key={index}>
                    <td>{protection.type}</td>
                    <td>{protection.provider}</td>
                    <td>{protection.coverageAmount > 0 ? formatCurrency(protection.coverageAmount) : 'N/A'}</td>
                    <td>{formatCurrency(protection.monthlyPremium)}</td>
                    <td>{protection.expirationDate ? format(new Date(protection.expirationDate), 'dd/MM/yyyy') : 'N/A'}</td>
                  </tr>
                ))}
                {protections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No protection plans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeProtection;
