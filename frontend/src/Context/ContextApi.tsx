import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import connectWS from "../socket";


type ContextType = {
  dark: boolean,
  toggleTheme: ()=> void,
}

export const DataContext = createContext<ContextType | null>(null);


const ContextApiProvider = ({children}: PropsWithChildren) => {
  const [dark, setDark] = useState<boolean>(true);

  const toggleTheme = ()=>{
    setDark(!dark);
  }

  const [socket, setSocket] = useState<any>(null);

  useEffect(()=>{
    const newSocket = connectWS();
    setSocket(newSocket);
  }, []);


  return (
    <DataContext.Provider value={{dark, toggleTheme}}>
      {children}
    </DataContext.Provider>
  )
}

export default ContextApiProvider;