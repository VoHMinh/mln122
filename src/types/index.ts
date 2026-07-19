export * from './game';

// ============================================================
// Wave / Section Data Types
// ============================================================

/** One of the four industrial revolution waves */
export interface Wave {
  id: number;
  name: string;
  year: string;
  coreTech: string[];
  leaders: string[];
  vietnamStatus: string;
  iconDescription: string;
}

/** A data highlight card (positive metric) */
export interface DataHighlight {
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
}

/** A disruption stat card (warning metric) */
export interface DataDisruption {
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
}

/** A country data point for comparison charts */
export interface ComparisonDataPoint {
  country: string;
  value: number;
  color: string;
}

/** Full comparison dataset */
export interface ComparisonDataset {
  rdSpending: ComparisonDataPoint[];
  researchersPerMillion: ComparisonDataPoint[];
}

/** A solution card */
export interface Solution {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

/** An opportunity or challenge item */
export interface OpportunityOrChallenge {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

/** A lesson learned from the analysis */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  example: string;
}

/** A source reference */
export interface Source {
  id: string;
  author: string;
  title: string;
  year: number;
  url?: string;
}

/** A section in the scrollytelling narrative */
export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
  type: 'hero' | 'waves' | 'data' | 'game' | 'solutions' | 'conclusion';
}
