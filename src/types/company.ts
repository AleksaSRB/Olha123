
export interface Company {
  id: string;
  name: string;
  sector: string;
  stage: string;
  partner: string;
  arr: number;
  arrGrowth: number;
  grossMargin: number;
  headcount: number;
  headcountChange: number;
  cashRunway: number;
  riskLevel: 'low' | 'medium' | 'high';
  aiAlert?: string;
  quarter: string;
}
