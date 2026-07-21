import { api } from "./apiService"

interface ICreatePoll {
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

const pollService = {

  async createPoll({title, description, expiresAt, questions, allowAnonymous}: ICreatePoll){
    const {data} = await api.post('/api/polls/create-poll', {title, description, expiresAt, questions, allowAnonymous})
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
  
}


export default pollService;
