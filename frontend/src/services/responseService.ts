import { api } from "./apiService";



const responseService = {

  async getDashboardData(){
    const {data} = await api.get(`/api/response/get-data`);
    return data;
  },
  
}


export default responseService;
