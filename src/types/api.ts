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

/**
 * Une énigme telle que le serveur la publie : jamais sa solution. Le sous-type se lit
 * dans `type`, puisque `@type` vaut "Riddle" pour les quatre.
 */
export interface RiddleAPI {
  "@context": string;
  "@id": string;
  "@type": string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  orderNumber: number;
  maxScoringAttempts: number;
  hunt: string;
}

export interface MCQRiddleAPI extends RiddleAPI {
  type: 'mcq';
  choices: string[];
  /** Absent quand le concepteur a choisi de ne pas l'annoncer. */
  expectedAnswerCount?: number;
}

export interface GPSRiddleAPI extends RiddleAPI {
  type: 'gps';
}

export interface QRRiddleAPI extends RiddleAPI {
  type: 'qr';
}

export interface TextRiddleAPI extends RiddleAPI {
  type: 'text';
}

export type AnyRiddleAPI = MCQRiddleAPI | GPSRiddleAPI | QRRiddleAPI | TextRiddleAPI;

/** Corps de POST /riddles/{id}/attempt : chaque type ne renseigne que son champ. */
export type RiddleAttempt = {
  proposal?: string;
  choices?: string[];
  latitude?: number;
  longitude?: number;
};

export type ParticipateRiddleAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  startTime: string;
  finishTime?: string;
  score: number;
  attempts: number;
  attemptsRemaining: number;
  solved: boolean;
  hunter: string;
  riddle: string;
};

export type ParticipateHuntAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number;
  rate: 0 | 1 | 2 | 3 | 4 | 5 | null;
  time: number;
  score: number;
  finished: boolean;
  riddlesSolved: number;
  lastParticipate: string;
  hunter: string;
  hunt: string;
  playerTeam: string | null;
  currentRiddle: string;
}

export type TeamParticipateHuntsAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  participateHunts: ParticipateHuntAPI[];
}

export type UserParticipateHuntsAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  participateHunts: ParticipateHuntAPI[];
}

export type TreasureHuntCollectionAPI = {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: TreasureHuntAPI[];
}