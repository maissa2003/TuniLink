import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCw } from "lucide-react";

export default function FinanceTaxes() {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Taxes & Charges</h1>
        <p className="text-slate-500 mt-1">Configure global tax rates, employer charges, and currency settings.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg">Financial Parameters</CardTitle>
          <CardDescription>These rates are applied globally across all payroll and invoice calculations.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Payroll Taxes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></div>
                Payroll Deductions
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cnss">CNSS Employee Rate (%)</Label>
                  <Input id="cnss" type="number" defaultValue="9.18" step="0.01" className="bg-white" />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="tax">Standard Income Tax Rate (%)</Label>
                  <Input id="tax" type="number" defaultValue="15.00" step="0.01" className="bg-white" />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="employer-cnss">CNSS Employer Rate (%)</Label>
                  <Input id="employer-cnss" type="number" defaultValue="16.57" step="0.01" className="bg-white" />
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center">
                <div className="w-1.5 h-4 bg-teal-500 rounded-full mr-2"></div>
                General Settings
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vat">VAT (Value Added Tax) (%)</Label>
                  <Input id="vat" type="number" defaultValue="19.00" step="0.01" className="bg-white" />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="bonus">Default Monthly Bonus</Label>
                  <Input id="bonus" type="number" defaultValue="0.00" step="10" className="bg-white" />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="currency">System Currency</Label>
                  <Select defaultValue="TND">
                    <SelectTrigger id="currency" className="bg-white">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TND">TND - Tunisian Dinar</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
          <Button variant="outline" className="border-slate-200">
            <RefreshCw className="mr-2 h-4 w-4 text-slate-500" /> Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]">
            {isSaving ? (
              <span className="flex items-center"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Saving...</span>
            ) : (
              <span className="flex items-center"><Save className="mr-2 h-4 w-4" /> Save Changes</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
