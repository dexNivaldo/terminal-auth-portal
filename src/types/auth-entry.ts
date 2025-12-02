export type EntryRole = 'AA' | 'CARRIER' | 'BROKER'
export type AuthApplication = 'TAS' | 'DPE'


export interface AuthEntry {
  id: number;
  patente: string;
  terminal: {
    id: number;
    code: string;
  };
  role: EntryRole;
  application: AuthApplication;
}


export interface AuthEntryInput {
  patente: string;
  terminal: number;
  role: EntryRole;
  user: string;
  application: AuthApplication;
}

