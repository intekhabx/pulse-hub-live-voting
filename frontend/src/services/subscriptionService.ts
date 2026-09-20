import { api } from "./apiService";


const subscriptionService = {

  getUserPlanDetails: async (plan: "FREE" | "PRO" | "PREMIUM") => {
    const {data} = await api.get(`/api/subscription/user-plan-details?plan=${plan}`);
    return data;
  },

  canFreeUserUseService: async () => {
    const {data} = await api.get("/api/subscription/can-user-use");
    return data;
  },

  exportAllPollCSV: async() => {
    const res = await api.get(`/api/subscription/export-everypoll-csv`, {
      responseType: "blob"
    });
    return res;
  },

  createSubscription: async(plan: "PRO" | "PREMIUM") => {
    const {data} = await api.post("/api/subscription/create", {plan});
    return data;
  },

  cancelSubscription: async() => {
    const res = await api.delete("/api/subscription/cancel");
    return res;
  },

}


export default subscriptionService;
