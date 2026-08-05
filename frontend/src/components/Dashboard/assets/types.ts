// ── Types ──────────────────────────────────────────────────────────────────

export interface IPoll {
  _id: string;
  title: string;
  // status: "active" | "expired" | "draft";
  questions: IQuestion[];
  description: string;
  createdAt: string;
  expiresAt: string;
  isPublished: boolean;
  allowAnonymous: boolean;
}

export interface IPollResponse {
  pollId: string;
  totalResponse: number;
  expiresAt: string;
}

export interface IActivityItem {
  pollId: number;
  pollTitle: string;
  message: string;
  icon: "response" | "publish" | "expire" | "create" | "delete" | "update";
  time: string;
}

export interface IDashboard {
  totalPolls: string;
  totalResponses: string;
  activePolls: string;
  publishedResult: string;
  polls: IPoll[];
}

export interface IQuestion {
  _id: string;
  questionText: string;
  required: boolean;
  options: IOption[];
}

export interface IOption {
  _id: string;
  optionText: string;
  votes: number;
}


export interface IPublishedPollQuestionsAnalytics {
  _id: string;
  question: string;
  totalVotes: string;
  options: { //option is an array of object under analytics
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
  }[]
}

export interface IPollAnalytics {
  title: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  isPublished: boolean;
  allowAnonymous: boolean;
  createdBy: string;
  analytics: { //analytics is an array of object
      _id: string;
      question: string;
      totalVotes: string;
      options: { //option is an array of object under analytics
        optionId: string;
        optionText: string;
        votes: number;
        percentage: number;
      }[]
  }[];
  pollId: string;
  anonymousPercentage: number;
  anonymousUserCount: number;
  authecticatedPercentage: number;
  authenticatedUserCount: number;
  totalResponseCount: number;
}


export interface IAnalyticsPageData {
  totalPolls: number;
  anonymousPolls: number;
  pollResponses: {
      pollId: string;
      totalVoteCount: number;
      pollTitle: string;
      expiresAt: string;
    }[];
}