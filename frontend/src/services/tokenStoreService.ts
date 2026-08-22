const ACCESS_KEY = "accessToken";
const USER_KEY = "user";

interface IUser {
  name: string,
  email: string,
  role: "user" | "admin",
  userId: string,
  isPasswordExists: boolean,
  isGoogleLinked: boolean,
  isGithubLinked: boolean,
}


const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getUser: ()=>{
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (user: IUser)=>{
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  set(accessToken: string, user?: IUser){
    if(accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if(user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear: ()=>{
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export default tokenStore;
