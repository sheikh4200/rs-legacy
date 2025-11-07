// app/types/index.ts
export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactInfoType {
  icon: string;
  title: string;
  description: string;
  link?: string;
}
