const ACCESSS_KEY = "accessToken";
const USER_KEY = "user";

interface IUser {
  name: string,
  email: string,
}


const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESSS_KEY),
  getUser: ()=>{
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  set(accessToken: string, user?: IUser){
    if(accessToken) localStorage.setItem(ACCESSS_KEY, accessToken);
    if(user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear: ()=>{
    localStorage.removeItem(ACCESSS_KEY),
    localStorage.removeItem(USER_KEY)
  }
}

export default tokenStore;
