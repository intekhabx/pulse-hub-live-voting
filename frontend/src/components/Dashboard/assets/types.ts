// ── Types ──────────────────────────────────────────────────────────────────

export interface Poll {
  _id: string;
  title: string;
  // status: "active" | "expired" | "draft";
  // responses: number;
  questions: [];
  description: string;
  createdAt: string;
  expiresAt: string;
  isPublished: boolean;
  allowAnonymous: boolean;
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
  questionText: string;
  required: boolean;
  options: { optionText: string }[];
}