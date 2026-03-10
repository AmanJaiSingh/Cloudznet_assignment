import { create } from "zustand";

export interface Incident {
  _id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "open" | "investigating" | "resolved";
  created_by: string;
  assigned_to?: string;
  team_id: string;
  created_at: string;
}

interface IncidentState {
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  removeIncident: (id: string) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, updated) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc._id === id ? { ...inc, ...updated } : inc
      ),
    })),
  removeIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((inc) => inc._id !== id),
    })),
}));
