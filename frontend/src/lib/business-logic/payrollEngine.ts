/**
 * TuniLink ERP Business Logic Engine
 * 
 * This engine handles the core ERP calculations for the Employee entity.
 * It ensures that financial logic is centralized, testable, and based on configurations,
 * rather than hardcoded in UI components.
 */

export interface ErpConfiguration {
  employeeCnssRate: number; // e.g., 0.0918 (9.18%)
  employerCnssRate: number; // e.g., 0.1657 (16.57%)
  recruitmentMarginRate: number; // e.g., 0.10 (10%)
  infrastructureMarginRate: number; // e.g., 0.10 (10%)
  taxBrackets: { limit: number; rate: number }[]; // Simplified tax logic
  globalExchangeRateTndToCad: number; // e.g., 0.45
}

export interface EmployeeContract {
  grossSalary: number;
  bonus: number;
}

export interface InfrastructureCosts {
  laptopCost: number;
  officeRent: number;
  internet: number;
  electricity: number;
  softwareLicenses: number;
  cloudServices: number;
  itSupport: number;
  other: number;
}

export interface PayrollCalculation {
  grossSalary: number;
  employeeCnssAmount: number;
  taxAmount: number;
  bonus: number;
  netSalary: number;
}

export interface EmployerCostCalculation {
  payroll: PayrollCalculation;
  employerCnssAmount: number;
  totalInfrastructureCost: number;
  subTotalCost: number;
  recruitmentMarginAmount: number;
  infrastructureMarginAmount: number;
  totalEmployerCost: number; // In TND
  finalInvoiceCad: number; // In CAD
}

// Default Configuration (In a real app, this would be fetched from a /settings API)
export const DEFAULT_ERP_CONFIG: ErpConfiguration = {
  employeeCnssRate: 0.0918,
  employerCnssRate: 0.1657,
  recruitmentMarginRate: 0.10,
  infrastructureMarginRate: 0.10,
  taxBrackets: [
    { limit: 5000, rate: 0.0 }, // 0% up to 5000 DT / year
    { limit: 20000, rate: 0.26 }, // 26% up to 20000 DT
    { limit: 30000, rate: 0.28 }, // 28% up to 30000 DT
    { limit: 50000, rate: 0.32 }, // 32% up to 50000 DT
    { limit: Infinity, rate: 0.35 } // 35% above
  ],
  globalExchangeRateTndToCad: 0.45,
};

/**
 * Simplified Tunisian IRPP (Tax) calculation based on annualized salary
 */
function calculateMonthlyTax(monthlyGross: number, config: ErpConfiguration): number {
  const annualized = monthlyGross * 12;
  let tax = 0;
  let remaining = annualized;

  for (let i = 0; i < config.taxBrackets.length; i++) {
    const bracket = config.taxBrackets[i];
    const prevLimit = i === 0 ? 0 : config.taxBrackets[i - 1].limit;
    
    if (annualized > prevLimit) {
      const taxableInBracket = Math.min(remaining, bracket.limit - prevLimit);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    if (remaining <= 0) break;
  }

  return tax / 12;
}

/**
 * Finance Domain: Calculates the Net Salary for the employee.
 * Logic: Gross - Employee CNSS - Taxes + Bonus = Net Salary
 */
export function calculatePayroll(
  contract: EmployeeContract,
  config: ErpConfiguration = DEFAULT_ERP_CONFIG
): PayrollCalculation {
  const employeeCnssAmount = contract.grossSalary * config.employeeCnssRate;
  const taxableBase = contract.grossSalary - employeeCnssAmount; // Simplified: usually CNSS is deductible before tax
  const taxAmount = calculateMonthlyTax(taxableBase, config);
  
  const netSalary = contract.grossSalary - employeeCnssAmount - taxAmount + contract.bonus;

  return {
    grossSalary: contract.grossSalary,
    employeeCnssAmount,
    taxAmount,
    bonus: contract.bonus,
    netSalary
  };
}

/**
 * Infrastructure Domain: Sums up all operational costs assigned to the employee.
 */
export function calculateTotalInfrastructureCost(costs: InfrastructureCosts): number {
  return costs.laptopCost + costs.officeRent + costs.internet + costs.electricity + costs.softwareLicenses + costs.cloudServices + costs.itSupport + costs.other;
}

/**
 * Client Billing / Employer Cost Domain: Calculates the total cost of the employee to the ERP platform,
 * and adds margins to determine the final billed amount (Total Employer Cost).
 */
export function calculateEmployerCost(
  contract: EmployeeContract,
  infraCosts: InfrastructureCosts,
  config: ErpConfiguration = DEFAULT_ERP_CONFIG
): EmployerCostCalculation {
  
  const payroll = calculatePayroll(contract, config);
  
  const employerCnssAmount = contract.grossSalary * config.employerCnssRate;
  const totalInfrastructureCost = calculateTotalInfrastructureCost(infraCosts);
  
  // Total cost before any margins are applied
  const subTotalCost = contract.grossSalary + employerCnssAmount + totalInfrastructureCost;
  
  // Margins applied based on configurations
  const recruitmentMarginAmount = subTotalCost * config.recruitmentMarginRate;
  const infrastructureMarginAmount = totalInfrastructureCost * config.infrastructureMarginRate;
  
  const totalEmployerCost = subTotalCost + recruitmentMarginAmount + infrastructureMarginAmount;
  const finalInvoiceCad = totalEmployerCost * config.globalExchangeRateTndToCad;

  return {
    payroll,
    employerCnssAmount,
    totalInfrastructureCost,
    subTotalCost,
    recruitmentMarginAmount,
    infrastructureMarginAmount,
    totalEmployerCost,
    finalInvoiceCad
  };
}
