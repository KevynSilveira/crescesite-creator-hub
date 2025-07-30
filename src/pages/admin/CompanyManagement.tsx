import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

interface CompanyInfo {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
}

const CompanyManagement = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .single();

      if (error) {
        console.error("Error loading company info:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações da empresa.",
          variant: "destructive",
        });
      } else if (data) {
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyInfo) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("company_info")
        .update({
          name: companyInfo.name,
          description: companyInfo.description,
          email: companyInfo.email,
          phone: companyInfo.phone,
          address: companyInfo.address,
          website: companyInfo.website,
          logo_url: companyInfo.logo_url,
        })
        .eq("id", companyInfo.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Informações da empresa atualizadas com sucesso!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanyInfo, value: string) => {
    if (companyInfo) {
      setCompanyInfo({
        ...companyInfo,
        [field]: value || null,
      });
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!companyInfo) {
    return <div className="p-6">Informações da empresa não encontradas.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Gerenciar Empresa
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={companyInfo.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={companyInfo.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyInfo.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={4}
              value={companyInfo.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              rows={3}
              value={companyInfo.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="logo_url">URL do Logo</Label>
            <Input
              id="logo_url"
              value={companyInfo.logo_url || ""}
              onChange={(e) => updateField("logo_url", e.target.value)}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;