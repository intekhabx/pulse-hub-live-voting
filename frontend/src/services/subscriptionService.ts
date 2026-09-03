import { api } from "./apiService";


const subscriptionService = {

  getUserPlanDetails: async (plan: "FREE" | "PRO" | "PREMIUM") => {
    const {data} = await api.get(`/api/subscription/user-plan-details?plan=${plan}`);
    return data;
  },

}


export default subscriptionService;
