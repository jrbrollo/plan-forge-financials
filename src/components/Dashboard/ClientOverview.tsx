
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { Client } from "@/lib/types";

interface ClientOverviewProps {
  client: Client;
}

export function ClientOverview({ client }: ClientOverviewProps) {
  return (
    <Card className="finance-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-finance-navy">Visão Geral do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{client.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Idade</p>
              <p className="font-medium">{client.age} anos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Phone className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
