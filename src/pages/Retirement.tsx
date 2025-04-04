
import React from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample retirement data for projection
const projectionData = Array.from({ length: 25 }, (_, i) => ({
  year: 2025 + i,
  projected: Math.round(10000 * Math.pow(1.08, i)),
  target: 5000000,
}));

const Retirement = () => {
  // Sample retirement plan data
  const retirementAge = 60;
  const currentAge = 35;
  const yearsToRetirement = retirementAge - currentAge;
  const targetIncome = 20000;
  const monthlySavings = 3000;
  const currentSavings = 50000;
  const projectedSavings = 5000000;
  const progressPercentage = (currentSavings / projectedSavings) * 100;
  
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
          <h1 className="text-2xl font-bold text-finance-navy">Retirement Planning</h1>
          <p className="text-gray-600">Plan and track your retirement goals.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Retirement Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between mb-2">
                    <span>Progress to Goal</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-gray-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Savings</p>
                    <p className="text-2xl font-bold text-finance-blue">{formatCurrency(currentSavings)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(projectedSavings)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Years to Retirement</p>
                    <p className="text-2xl font-bold">{yearsToRetirement} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Desired Monthly Income</p>
                    <p className="text-2xl font-bold">{formatCurrency(targetIncome)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Current Monthly Contribution</p>
                  <p className="text-xl font-semibold">{formatCurrency(monthlySavings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-finance-navy">Retirement Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Current Strategy</h3>
                  <p className="text-gray-600">Based on your current savings rate of {formatCurrency(monthlySavings)} per month, you are on track to reach approximately {formatCurrency(projectedSavings)} by age {retirementAge}.</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
                    <li>Increase monthly contributions by at least 10% annually</li>
                    <li>Diversify retirement investments across different asset classes</li>
                    <li>Consider additional tax-advantaged retirement accounts</li>
                    <li>Review and adjust your retirement plan annually</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Risk Assessment</h3>
                  <p className="text-gray-600">Your current retirement plan has a medium risk profile. As you get closer to retirement, consider adjusting to lower-risk investments.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-finance-navy">Retirement Savings Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="projected" stroke="#2B4C91" name="Projected Savings" />
                  <Line type="monotone" dataKey="target" stroke="#38A169" strokeDasharray="5 5" name="Target Amount" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Retirement;
