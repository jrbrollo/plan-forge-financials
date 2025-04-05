import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Download, Upload, UserPlus, Users, Database, RefreshCcw, 
  FileText, AlertTriangle, CheckCircle, XCircle, Trash2 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClients, addTestClient } from "@/services/clientService";
import { clientStorage, exportAllData, importAllData } from "@/services/storageService";

const Admin = () => {
  const [clients, setClients] = useState<{ total: number, complete: number, incomplete: number }>({
    total: 0,
    complete: 0,
    incomplete: 0
  });
  const [backupDate, setBackupDate] = useState<string | null>(null);
  const [jsonExport, setJsonExport] = useState<string>('');
  const [showExport, setShowExport] = useState(false);
  const [importText, setImportText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Obter estatísticas de clientes
    const allClients = getClients();
    const complete = allClients.filter(client => 
      Boolean(client.name && client.email && client.phone && client.age)
    ).length;
    
    setClients({
      total: allClients.length,
      complete,
      incomplete: allClients.length - complete
    });

    // Verificar data do último backup
    const lastBackup = localStorage.getItem('plan_forge_last_backup');
    setBackupDate(lastBackup);

    // Limpar exportação
    setShowExport(false);
  };

  const handleAddTestClient = () => {
    const client = addTestClient();
    toast({
      title: "Cliente de teste adicionado",
      description: `${client.name} foi adicionado com sucesso.`
    });
    refreshData();
  };

  const handleExportData = () => {
    const data = exportAllData();
    setJsonExport(data);
    setShowExport(true);
    toast({
      title: "Dados exportados",
      description: "Copie o JSON gerado para um arquivo de backup."
    });
  };

  const handleImportData = () => {
    try {
      if (!importText.trim()) {
        toast({
          title: "Erro ao importar",
          description: "O texto de importação está vazio.",
          variant: "destructive"
        });
        return;
      }

      const result = importAllData(importText);
      
      if (result) {
        toast({
          title: "Dados importados",
          description: "Os dados foram importados com sucesso."
        });
        refreshData();
        setImportText('');
      } else {
        toast({
          title: "Erro ao importar",
          description: "Houve um erro ao processar os dados de importação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao importar",
        description: "O formato dos dados é inválido.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = () => {
    if (confirm("ATENÇÃO: Esta ação irá remover TODOS os dados da aplicação. Esta ação não pode ser desfeita. Deseja continuar?")) {
      clientStorage.clear();
      localStorage.removeItem('plan_forge_financial_plans');
      localStorage.removeItem('plan_forge_investments');
      localStorage.removeItem('plan_forge_protections');
      
      toast({
        title: "Dados limpos",
        description: "Todos os dados foram removidos."
      });
      
      refreshData();
    }
  };

  const handleRestoreBackup = () => {
    const result = clientStorage.restoreFromBackup();
    
    if (result) {
      toast({
        title: "Backup restaurado",
        description: "Os dados foram restaurados do último backup."
      });
      refreshData();
    } else {
      toast({
        title: "Erro ao restaurar",
        description: "Não foi possível restaurar o backup.",
        variant: "destructive"
      });
    }
  };

  const downloadExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonExport);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `planforge_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-finance-navy">Administração do Sistema</h1>
          <p className="text-gray-600">Gerencie dados, backup e restauração do sistema.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total de clientes:</span>
                  <span className="font-medium">{clients.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfis completos:</span>
                  <span className="font-medium text-green-600">{clients.complete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfis incompletos:</span>
                  <span className="font-medium text-amber-600">{clients.incomplete}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                className="w-full flex items-center justify-center"
                onClick={handleAddTestClient}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Cliente de Teste
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Database className="h-5 w-5 mr-2 text-green-500" />
                Backup do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Último backup:</span>
                  <span className="font-medium">
                    {backupDate ? new Date(backupDate).toLocaleString() : 'Nunca'}
                  </span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Button 
                  className="w-full flex items-center justify-center"
                  variant="outline"
                  onClick={handleRestoreBackup}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Restaurar Último Backup
                </Button>
                
                <Button 
                  className="w-full flex items-center justify-center"
                  variant="destructive"
                  onClick={handleClearAllData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-purple-500" />
                Exportar/Importar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  className="w-full flex items-center justify-center"
                  onClick={handleExportData}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                
                <Button 
                  className="w-full flex items-center justify-center"
                  onClick={() => document.getElementById('importFileInput')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
                <input
                  id="importFileInput"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setImportText(event.target.result as string);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="export">Exportar Dados</TabsTrigger>
            <TabsTrigger value="import">Importar Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados do Sistema</CardTitle>
                <CardDescription>
                  Exporte todos os dados para backup ou transferência para outro ambiente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showExport ? (
                  <>
                    <Alert className="mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Dados exportados com sucesso</AlertTitle>
                      <AlertDescription>
                        Copie o JSON abaixo ou faça o download do arquivo.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mb-4">
                      <Button onClick={downloadExport} className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download do Arquivo JSON
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        className="w-full h-60 p-4 border rounded bg-gray-50 font-mono text-sm"
                        value={jsonExport}
                        readOnly
                      />
                      <Button 
                        className="absolute top-2 right-2"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(jsonExport);
                          toast({
                            title: "Copiado!",
                            description: "Os dados foram copiados para a área de transferência."
                          });
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12">
                    <FileText className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-6">Clique no botão abaixo para gerar a exportação de dados.</p>
                    <Button onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Gerar Exportação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Importar Dados para o Sistema</CardTitle>
                <CardDescription>
                  Importe dados de um arquivo JSON previamente exportado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    A importação substituirá todos os dados existentes. Faça um backup antes de continuar.
                  </AlertDescription>
                </Alert>
                
                {importText ? (
                  <>
                    <div className="mb-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Arquivo carregado</AlertTitle>
                        <AlertDescription>
                          Verifique se é o arquivo correto e clique em "Importar Dados" para continuar.
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="flex justify-between mb-4">
                      <Button variant="outline" onClick={() => setImportText('')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleImportData}>
                        <Upload className="h-4 w-4 mr-2" />
                        Importar Dados
                      </Button>
                    </div>
                    
                    <div>
                      <textarea
                        className="w-full h-40 p-4 border rounded bg-gray-50 font-mono text-sm"
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12">
                    <Upload className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-6">Selecione um arquivo JSON para importar.</p>
                    <Button onClick={() => document.getElementById('importFileInput')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 