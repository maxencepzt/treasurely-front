export type User = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  nickname: string;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: string;
  phone: string;
  creationDate: string;
  public: boolean;
  gender: "MAN" | "WOMAN" | "OTHER";
  profilePicture: string;
  totalTime: number;
  totalHunt: number;
  description?: string;
  teams?: string[];
};

export type HuntTypeAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  title: string;
}

export type TreasureHuntAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  title: string;
  description: string;
  public: boolean;
  difficulty: number;
  riddleCount: number;
  huntType: HuntTypeAPI[];
  team: string;
  owner: string;
  location: string;
}

export type TeamAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  name: string;
  description: string;
  owner: string;
}