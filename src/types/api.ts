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
  totalRiddles: number;
  totalScore: number;
  description?: string;
  teams?: string[];
};

export type HuntTypeAPI = {
  "@context"?: string;
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
  status: 'opened' | 'closed' | 'draft';
  difficulty: 1 | 2 | 3;
  riddleCount: number;
  huntType: HuntTypeAPI[];
  designerTeam: string;
  owner: string;
  location: string;
  estimatedTime: number;
  creationAt: string;
}

export const TreasureHuntStatusOpened = 'opened';
export const TreasureHuntStatusClosed = 'closed';
export const TreasureHuntStatusDraft = 'draft';

export type TeamMember = {
  "@context": string;
  "@id": string;
  "@type": string;
  nickname: string;
}

export type TeamAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  name: string;
  description: string;
  owner: string;
  members?: TeamMember[];
  code?: string;
}

export type TeamMembersAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  members: TeamMember[];
}

export type TeamTreasureHuntsAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  title: string;
  difficulty: 1 | 2 | 3;
  riddleCount: number;
  location: string;
  estimatedTime: number;
  members?: TeamMember[];
}

export type UserTeamsAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  teams: string[];
}

export interface RiddleAPI {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
}

export interface MCQRiddleAPI extends RiddleAPI {
  choices: string[];
  answers: string[];
}

export interface GPSRiddleAPI extends RiddleAPI {
  latitude: number;
  longitude: number;
}

export interface QRRiddle extends RiddleAPI {
  code: string;
}

export interface TextRiddleAPI extends RiddleAPI {
  answer: string;
}

export type AnyRiddleAPI = MCQRiddleAPI | GPSRiddleAPI | QRRiddle | TextRiddleAPI;

export type ParticipateHuntAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  user: string;
  treasureHunt: string;
  gameTeam?: string;
  currentRiddle: number;
  startedAt: string;
  completedAt?: string;
  totalTime?: number;
  score?: number;
  status: 'in_progress' | 'completed';
}

