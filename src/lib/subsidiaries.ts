
import data from './subsidiaries.json';

export interface Subsidiary {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  healthCheckUrl: string;
  functions: string[];
};

export const subsidiaries: Subsidiary[] = data.subsidiaries;
