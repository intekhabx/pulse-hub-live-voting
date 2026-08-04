export interface IUser {
  email: string;
  name: string;
  role: string;
  userId: string;
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