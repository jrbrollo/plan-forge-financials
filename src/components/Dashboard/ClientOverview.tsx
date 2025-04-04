
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/lib/types";

interface ClientOverviewProps {
  client: Client;
}

export function ClientOverview({ client }: ClientOverviewProps) {
  return (
    <Card className="finance-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-finance-navy">Client Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{client.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-medium">{client.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{client.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{client.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
