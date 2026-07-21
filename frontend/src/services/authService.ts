import { api } from "./apiService";
import tokenStore from "./tokenStoreService";


interface IRegister {
  name: string,
  email: string,
  password: string,
}

interface ILogin {
  email: string,
  password: string
}

const authService = {

    async register({ name, email, password }: IRegister) {
        const res = await api.post("/api/auth/register", { name, email, password });
        return res;
    },

    async login({email, password}: ILogin){
        const {data} = await api.post("/api/auth/login", {email, password})
        // console.log(data);
        // console.log(data.data.accessToken, data.data.user);
        tokenStore.set(data.data.accessToken, data.data.user);
        return data
    },
    
    async logout(){
        await api.post("/api/auth/logout")
        tokenStore.clear()
    },

    async getUserSession(){
      const res = await api.get("/api/auth/user-session");
      return res;
    },

}

export default authService;