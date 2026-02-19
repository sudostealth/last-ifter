
export enum Language {
  EN = 'en',
  BN = 'bn'
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface MenuItem {
  name: { en: string; bn: string };
  icon: string;
  description: { en: string; bn: string };
}

export interface RegistrationData {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  batch: string;
  dept: string;
  paymentMethod: 'bkash' | 'rocket';
  senderNo: string;
  trxId: string;
}

export interface EventConfig {
  date: string;
  time: string;
  venue: string;
  fee: number;
}
