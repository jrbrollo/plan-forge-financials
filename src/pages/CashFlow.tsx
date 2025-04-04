
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CashFlow = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-finance-navy">Cash Flow</h1>
          <p className="text-gray-600">Manage and analyze your cash flow.</p>
        </div>
        
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-finance-navy">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will contain detailed cash flow analysis, including income sources, expense breakdowns, and projections over time.</p>
            <p className="mt-4 text-gray-500">Coming soon: Cash flow projections and scenarios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlow;
