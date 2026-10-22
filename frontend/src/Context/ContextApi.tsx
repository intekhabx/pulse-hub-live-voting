import { createContext, useEffect, useRef, useState, type PropsWithChildren } from "react";
import connectWS from "../socket";
import type { IUser } from "../types";
import tokenStore from "../services/tokenStoreService";


export type ICustomBranding = {
  brandName?: string;
  brandImageUrl?: string;
  primaryColor?: string;
  websiteUrl?: string;
  footerText?: string;
};

export type ContextType = {
  dark: boolean,
  toggleTheme: ()=> void,
  user: IUser | null,
  setAuthUser: (user: IUser) => void,
  removeAuthUser: () => void,
  socketRef: React.RefObject<ReturnType<typeof connectWS> | null>,
  socketReady: boolean,
  customBranding: ICustomBranding | null,
  setCustomBranding: React.Dispatch<React.SetStateAction<ICustomBranding | null>>,
  brandingLoading: boolean,
  setBrandingLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export const DataContext = createContext<ContextType | null>(null);


const ContextApiProvider = ({children}: PropsWithChildren) => {

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default
  });
  const [customBranding, setCustomBranding] = useState<ICustomBranding | null>(null);
  const [brandingLoading, setBrandingLoading] = useState(false);
  
  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };


  // check user is loggedIn or not to show buttons on page
  const [user, setUser] = useState<IUser | null>(null);

  // App load hone par check karega
  useEffect(()=> {
    const authenticateUser = ()=> {
      const storedUser = tokenStore.getUser();
      const accessToken = tokenStore.getAccessToken();
  
      if(storedUser && accessToken){
        setUser(storedUser);
      }
    }
    authenticateUser();
  }, [])


  // Login ke baad user state update karne ke liye
  const setAuthUser = (user: IUser) => {
    setUser(user);
  };

  // Logut ke baad user state me data remove krne ke liye
  const removeAuthUser = () => {
    setUser(null);
  };



  // socket.io connection working*****
  const socketRef = useRef<ReturnType<typeof connectWS> | null>(null);
  const [socketReady, setSocketReady] = useState<boolean>(false);

  useEffect(()=>{
    socketRef.current = connectWS();

    socketRef.current.on("connect", ()=> {
      console.log('connected', socketRef.current?.id);
      setSocketReady(true);
    })

    socketRef.current.on("disconnect", ()=> {
      setSocketReady(false);
    })

    socketRef.current.connect();

    return ()=> {
      socketRef.current?.disconnect();
      socketRef.current = null;
    }
  }, []);


  return (
    <DataContext.Provider value={{dark, toggleTheme, user, setAuthUser, removeAuthUser, socketRef, socketReady, customBranding, setCustomBranding, brandingLoading, setBrandingLoading}}>
      {children}
    </DataContext.Provider>
  )
}

export default ContextApiProvider;
