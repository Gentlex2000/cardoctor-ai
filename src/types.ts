export interface CarModel {
  id: string;
  label: string;
  year: number;
  make: string;
  model: string;
}

export interface DiagnosisCause {
  id: string;
  name: string;
  probability: number;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  price: number;
  have: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  price: number;
  have: boolean;
}

export interface RepairStep {
  id: number;
  title: string;
  description: string;
  warning?: string;
  tip?: string;
  duration: string;
  imageUrl?: string;
}

export interface DiagnosisResult {
  carModel: string;
  symptom: string;
  causes: DiagnosisCause[];
  diyDifficulty: number;
  estimatedSavings: number;
  estimatedShopCost: number;
  estimatedDiyCost: number;
  tools: ToolItem[];
  materials: MaterialItem[];
  safetyWarnings: string[];
  steps: RepairStep[];
}

export type Screen = 'home' | 'report' | 'guide';
