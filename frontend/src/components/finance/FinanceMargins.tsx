import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, ArrowRight, Percent, Calculator } from "lucide-react";

export default function FinanceMargins() {
  const [infraMargin, setInfraMargin] = useState(10);
  const [recruitmentMargin, setRecruitmentMargin] = useState(12);
  const [isSaving, setIsSaving] = useState(false);
  
  // Example calculation base values
  const basePayroll = 3000;
  const employerCharges = basePayroll * 0.1657; // 497.10
  const totalCost = basePayroll + employerCharges; // 3497.10
  
  const appliedInfra = totalCost * (infraMargin / 100);
  const appliedRecruitment = totalCost * (recruitmentMargin / 100);
  const finalClientBilling = totalCost + appliedInfra + appliedRecruitment;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profit Margins</h1>
        <p className="text-slate-500 mt-1">Configure your business margins for client billing and simulations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Settings Form */}
        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-lg flex items-center">
              <Percent className="mr-2 h-5 w-5 text-indigo-500" />
              Margin Configuration
            </CardTitle>
            <CardDescription>Set the percentage applied on top of total employee costs.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="infra" className="text-slate-700 font-medium">Infrastructure Margin (%)</Label>
              <div className="relative">
                <Input 
                  id="infra" 
                  type="number" 
                  value={infraMargin}
                  onChange={(e) => setInfraMargin(Number(e.target.value))}
                  className="pl-4 pr-10 text-lg font-medium" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
              </div>
              <p className="text-xs text-slate-500">Covers operating costs like office, internet, and utilities.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rec" className="text-slate-700 font-medium">Recruitment Agency Margin (%)</Label>
              <div className="relative">
                <Input 
                  id="rec" 
                  type="number" 
                  value={recruitmentMargin}
                  onChange={(e) => setRecruitmentMargin(Number(e.target.value))}
                  className="pl-4 pr-10 text-lg font-medium" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
              </div>
              <p className="text-xs text-slate-500">Profit margin for recruitment and administrative services.</p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 p-6 bg-slate-50/50">
            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Apply Global Margins</>}
            </Button>
          </CardFooter>
        </Card>

        {/* Live Simulation Preview */}
        <Card className="shadow-sm border-indigo-100 bg-indigo-50/30">
          <CardHeader className="border-b border-indigo-100 bg-white">
            <CardTitle className="text-lg flex items-center text-indigo-900">
              <Calculator className="mr-2 h-5 w-5 text-indigo-600" />
              Live Example Calculation
            </CardTitle>
            <CardDescription>Based on an employee with 3,000 TND Gross Salary.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">Base Gross Salary</span>
              <span className="font-semibold text-slate-900">{basePayroll.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">Employer Charges (16.57%)</span>
              <span className="font-semibold text-slate-900">+{employerCharges.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-800 text-white rounded-lg shadow-sm">
              <span className="text-sm font-medium">Total Employer Cost</span>
              <span className="font-bold">{totalCost.toFixed(2)}</span>
            </div>

            <div className="pt-2 pb-2 flex justify-center">
              <ArrowRight className="h-5 w-5 text-slate-300 rotate-90" />
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-100 border-l-4 border-l-blue-400">
              <span className="text-sm font-medium text-slate-600">Infrastructure Margin ({infraMargin}%)</span>
              <span className="font-semibold text-blue-600">+{appliedInfra.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-indigo-100 border-l-4 border-l-indigo-400">
              <span className="text-sm font-medium text-slate-600">Recruitment Margin ({recruitmentMargin}%)</span>
              <span className="font-semibold text-indigo-600">+{appliedRecruitment.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-lg shadow-md mt-4">
              <span className="font-semibold">Final Client Billing</span>
              <span className="text-xl font-bold">{finalClientBilling.toFixed(2)} TND</span>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
