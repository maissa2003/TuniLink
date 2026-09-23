import api from "./axios";

export interface SimulationInput {
  resourceRequestId?: number;
  scenarioName: string;
  baseNetSalaryTnd: number;
  durationYears: number;
  annualIncreasePercent: number;
  recruitmentMarginPercent?: number;
  infrastructureMarginPercent?: number;
  fixedInfrastructureCostTnd?: number;
  exchangeRateTndToCad?: number;
}

export interface SimulationYear {
  year: number;
  netSalaryTnd: number;
  grossSalaryTnd: number;
  employerChargesTnd: number;
  totalPayrollCostTnd: number;
  infrastructureCostTnd: number;
  subTotalBeforeMarginTnd: number;
  recruitmentMarginAmountTnd: number;
  infrastructureMarginAmountTnd: number;
  totalCostTnd: number;
  exchangeRateUsed: number;
  finalInvoicedCad: number;
}

export interface SimulationResult {
  scenarioName: string;
  candidateName?: string;
  candidateBio?: string;
  baseNetSalaryTnd: number;
  durationYears: number;
  annualIncreasePercent: number;
  recruitmentMarginPercent: number;
  infrastructureMarginPercent: number;
  fixedInfrastructureCostTnd: number;
  exchangeRateTndToCad: number;
  years: SimulationYear[];
  totalCostOverPeriodCad: number;
  averageMonthlyCostCad: number;
}

export const runSimulation = async (input: SimulationInput): Promise<SimulationResult> => {
  const res = await api.post<SimulationResult>("/simulations/calculate", input);
  return res.data;
};
