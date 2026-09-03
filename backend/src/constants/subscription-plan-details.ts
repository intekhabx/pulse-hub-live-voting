export const SUBSCRIPTION_PLAN_DETAILS = {
  FREE: {
    price: 0,

    maxPolls: 5,
    maxActivePolls: 5,
    maxQuestionsPerPoll: 5,
    maxResponsesPerPoll: 100,

    advancedAnalytics: false,
    csvExport: false,
    removeBranding: false,
    customBranding: false,
    prioritySupport: false,
  },

  PRO: {
    price: 99,

    maxPolls: 50,
    maxActivePolls: 50,
    maxQuestionsPerPoll: 25,
    maxResponsesPerPoll: 2500,

    advancedAnalytics: true,
    csvExport: true,
    removeBranding: true,
    customBranding: false,
    prioritySupport: false,
  },

  PREMIUM: {
    price: 299,

    maxPolls: Infinity,
    maxActivePolls: Infinity,
    maxQuestionsPerPoll: Infinity,
    maxResponsesPerPoll: Infinity,

    advancedAnalytics: true,
    csvExport: true,
    removeBranding: true,
    customBranding: true,
    prioritySupport: true,
  },
} as const;
