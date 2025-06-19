export interface AuthEntry {
  id: number;
  patente: string;
  terminal: {
    id: number
    code: string
  };
  role: 'AA' | 'CARRIER'
  isProd: boolean
}

export interface AuthEntryInput {
  patente: string;
  terminal: number;
  role: 'AA' | 'CARRIER'
  isProd: boolean
  user: string
}

