export const SUBSCRIPTION_PLAN_DETAILS = {
  FREE: {
    price: 0,

    maxPolls: 3,
    maxActivePolls: 3,
    maxQuestionsPerPoll: 5,
    maxResponsesPerPoll: 100,
    maxAiCalls: 3,

    advancedAnalytics: false,
    csvExport: false,
    customBranding: false,
    prioritySupport: false,
  },

  PRO: {
    price: 99,

    maxPolls: 50,
    maxActivePolls: 50,
    maxQuestionsPerPoll: 25,
    maxResponsesPerPoll: 2500,
    maxAiCalls: 49,

    advancedAnalytics: true,
    csvExport: true,
    customBranding: false,
    prioritySupport: false,
  },

  PREMIUM: {
    price: 299,

    maxPolls: Infinity,
    maxActivePolls: Infinity,
    maxQuestionsPerPoll: Infinity,
    maxResponsesPerPoll: Infinity,
    maxAiCalls: 199,

    advancedAnalytics: true,
    csvExport: true,
    customBranding: true,
    prioritySupport: true,
  },
} as const;
