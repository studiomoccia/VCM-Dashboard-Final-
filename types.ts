
export interface VCMState {
  ricaviY5: number;
  ricaviUnita: number;
  multiplo: number;
  discountRate: number;
  anni: number;
  investimento: number;
  investUnita: number;
  settore: string;
}

export interface VCMResults {
  exitValue: number;
  valuationToday: number;
  preMoneyVal: number;
  vcOwnership: number;
  roiAtteso: number;
  profitto: number;
  powerFactor: number;
}

export interface SensitivityData {
  dr: string;
  valuation: number;
}

export enum CurrencyUnit {
  MILLIONS = 1000000,
  THOUSANDS = 1000,
  ONES = 1
}
