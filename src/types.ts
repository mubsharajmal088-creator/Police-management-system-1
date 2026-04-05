export type FIRStatus = "Pending" | "In-Progress" | "Closed";

export interface FIR {
  id: string;
  complainantName: string;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  status: FIRStatus;
  assignedOfficerId?: string;
  createdAt: string;
}

export interface Officer {
  id: string;
  name: string;
  rank: string;
  station: string;
  badgeNumber: string;
}

export interface Case {
  id: string;
  firId: string;
  status: FIRStatus;
  updates: CaseUpdate[];
}

export interface CaseUpdate {
  id: string;
  date: string;
  note: string;
  updatedBy: string;
}
