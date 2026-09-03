export interface IUser {
  email: string;
  name: string;
  role: string;
  userId: string;
  plan: "FREE" | "PRO" | "PREMIUM",
  isPasswordExists: boolean,
  isGoogleLinked: boolean,
  isGithubLinked: boolean,
}


export interface ICreatePoll {
  title: string;
  description: string;
  expiresAt: string;
  questions: {
      questionText: string;
      required: boolean;
      options:
        {
          optionText: string
        }[];
    }[];
  allowAnonymous: boolean,
}

export interface IUpdatePoll {
  title?: string;
  description?: string;
  expiresAt?: string;
  questions?: {
      questionText: string;
      required: boolean;
      options:
        {
          optionText: string
        }[];
    }[];
  allowAnonymous?: boolean,
}


export interface IPlanDetails {
  price: number;

  maxPolls: number | string,
  maxActivePolls: number | string,
  maxQuestionsPerPoll: number | string,
  maxResponsesPerPoll: number | string,

  advancedAnalytics: boolean,
  csvExport: boolean,
  removeBranding: boolean,
  customBranding: boolean,
  prioritySupport: boolean,
}
