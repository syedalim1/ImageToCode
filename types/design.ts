export interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: { content: string };
  description: string | null;
  email: string | null;
  createdAt: string;
  options: string[];
  mode: string;
  theme: string;
  language: string;
}
