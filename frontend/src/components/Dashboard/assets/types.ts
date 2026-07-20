// ── Types ──────────────────────────────────────────────────────────────────

export interface Poll {
  _id: string;
  title: string;
  // status: "active" | "expired" | "draft";
  // responses: number;
  questions: [Question];
  description: string;
  createdAt: string;
  expiresAt: string;
  isPublished: boolean;
  allowAnonymous: boolean;
}

export interface IPollResponse {
  pollId: string;
  totalResponse: number;
}

export interface ActivityItem {
  id: number;
  poll: string;
  action: string;
  time: string;
  icon: string;
}

export interface IDashboard {
  totalPolls: string;
  totalResponses: string;
  activePolls: string;
  publishedResult: string;
  polls: [Poll];
}

export interface Question {
  _id: string;
  questionText: string;
  required: boolean;
  options: [Option];
}

export interface Option {
  _id: string;
  optionText: string;
  votes: number;
}