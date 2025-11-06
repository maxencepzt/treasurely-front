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
};