import { api } from "./apiService";


interface IMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}



const messageService = {

  async sendMessage({name, email, subject, message}: IMessage){
    const res = await api.post("/api/contact/message", {name, email, subject, message});
    return res;
  },

}

export default messageService;
