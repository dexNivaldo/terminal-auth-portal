export type EntryRole = 'AA' | 'CARRIER'

export interface AuthEntry {
  id: number;
  patente: string;
  terminal: {
    id: number
    code: string
  };
  role: EntryRole
}

export interface AuthEntryInput {
  patente: string;
  terminal: number;
  role: EntryRole
  user: string
}

