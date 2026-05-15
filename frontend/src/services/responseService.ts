import { api } from "./apiService";



const responseService = {

  async submitVote(pollId: string, answers: any[]){
    const {data} = await api.post(`/api/response/submit-vote/${pollId}`, {answers});
    return data;
  },
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
