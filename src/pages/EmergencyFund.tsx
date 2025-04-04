
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const EmergencyFund = () => {
  // Sample data
  const target = 120000;
  const current = 10000;
  const progressPercentage = (current / target) * 100;
  
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
          <h1 className="text-2xl font-bold text-finance-navy">Emergency Fund</h1>
          <p className="text-gray-600">Track and build your emergency savings.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Emergency Fund Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-gray-200" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Current Savings</p>
                    <p className="text-2xl font-bold text-finance-blue">{formatCurrency(current)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(target)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Remaining to save</p>
                  <p className="text-xl font-semibold">{formatCurrency(target - current)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Target Size</h3>
                  <p className="text-gray-600">Your emergency fund should cover 6 months of essential expenses.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Monthly Contribution</h3>
                  <p className="text-gray-600">To reach your target in 3 years, you should contribute <span className="font-semibold">{formatCurrency((target - current) / 36)}</span> per month.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Where to Save</h3>
                  <p className="text-gray-600">Keep your emergency fund in highly liquid accounts with easy access.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-finance-navy">Emergency Fund Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This section will include a calculator to determine the ideal emergency fund size based on your monthly expenses and risk factors.</p>
            <p className="mt-4 text-gray-500">Coming soon: Interactive emergency fund calculator</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyFund;
