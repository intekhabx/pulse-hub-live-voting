import { api } from "./apiService";



const responseService = {

  async publishPollResult(pollId: string){
    const {data} = await api.post(`/api/response/publish/${pollId}`);
    return data;
  },

  async getDashboardData(){
    const {data} = await api.get(`/api/response/get-data`);
    return data;
  }
}


export default responseService;
