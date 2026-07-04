import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import connectWS from "../socket";
import responseService from "../services/responseService";
import type { IDashboard } from "../components/Dashboard/assets/types";


export type ContextType = {
  dark: boolean,
  toggleTheme: ()=> void,
  dashboardData: IDashboard | undefined,
  setDashboardData: React.Dispatch<React.SetStateAction<IDashboard | undefined>>
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




  const [dashboardData, setDashboardData] = useState<IDashboard>();
 
  const fetchDashboardData = async () => {
    const res = await responseService.getDashboardData();
    console.log(res.data);
    setDashboardData(res.data);
  };
 
  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <DataContext.Provider value={{dark, toggleTheme, dashboardData, setDashboardData}}>
      {children}
    </DataContext.Provider>
  )
}

export default ContextApiProvider;