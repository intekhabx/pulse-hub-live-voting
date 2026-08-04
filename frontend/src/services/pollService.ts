import type { ICreatePoll, IUpdatePoll } from "../types";
import { api } from "./apiService"



const pollService = {

  async createPoll({title, description, expiresAt, questions, allowAnonymous}: ICreatePoll){
    const {data} = await api.post('/api/polls/create-poll', {title, description, expiresAt, questions, allowAnonymous})
    return data;
  },

  async updatePoll(pollId: string, {title, description, expiresAt, questions, allowAnonymous}: IUpdatePoll){
    const {data} = await api.patch(`/api/polls/update-poll/${pollId}`, {title, description, expiresAt, questions, allowAnonymous});
    return data;
  },

  async getMyPolls(){
    const {data} = await api.get('/api/polls/get-mypolls');
    return data;
  },

  async getPollById(pollId: string){
    const {data} = await api.get(`/api/polls/get-poll/${pollId}`);
    return data;
  },

  async getPollAnalytics(pollId: string){
    const {data} = await api.get(`/api/polls/get-poll-analytics/${pollId}`);
    return data;
  },

  async submitVote(pollId: string, answers: {questionId: string, optionId: string}[]){
    const {data} = await api.post(`/api/polls/submit-vote/${pollId}`, {answers});
    return data;
  },

  async getAnalyticsPageData(){
    const {data} = await api.get("/api/polls/get-analytics-page-data");
    return data;
  },

  async deletePollById(pollId: string){
    const {data} = await api.delete(`/api/polls/delete-poll/${pollId}`);
    return data;
  },

  async getRecentActivity(){
    const {data} = await api.get("/api/polls/get-recent-activity");
    return data;
  }
  
}


export default pollService;
