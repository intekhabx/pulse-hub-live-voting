import { createContext, useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";
import connectWS from "../socket";
import responseService from "../services/responseService";
import type { IDashboard } from "../components/Dashboard/assets/types";


export type ContextType = {
  dark: boolean,
  toggleTheme: ()=> void,
  dashboardData: IDashboard | undefined,
  dashboardLoading: boolean,
  setDashboardData: React.Dispatch<React.SetStateAction<IDashboard | undefined>>,
  refreshDashboardData: () => Promise<void>,
  socketRef: React.RefObject<ReturnType<typeof connectWS> | null>;
}

export const DataContext = createContext<ContextType | null>(null);


const ContextApiProvider = ({children}: PropsWithChildren) => {
  const [dark, setDark] = useState<boolean>(true);

  const toggleTheme = ()=>{
    setDark(!dark);
  }

  // socket.io connection working
  const socketRef = useRef<ReturnType<typeof connectWS> | null>(null);

  useEffect(()=>{
    socketRef.current = connectWS();

    socketRef.current.on("connect", ()=> {
      // console.log('connected', socketRef.current?.id);
      socketRef.current?.emit("from-client", localStorage.getItem("user"));
    })
    return ()=> {
      socketRef.current?.disconnect();
    }
  }, []);


  useEffect(()=> {
    socketRef.current?.on("from-server", (data)=> {
      console.log(data)
    })

    socketRef.current?.on("server:poll-updated", (data)=> {
      console.log(data)
    })

    socketRef.current?.on("server:poll-created", ()=> {
      refreshDashboardData();
    })
  }, [])



  // overview section data
  const [dashboardData, setDashboardData] = useState<IDashboard>();
  const [dashboardLoading, setDashboardLoading] = useState(true);
 
  const refreshDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await responseService.getDashboardData();
      setDashboardData(res.data);
    } catch (error) {
      // A guest session cannot access dashboard data; it is fetched again after login.
      setDashboardData(undefined);
    } finally {
      setDashboardLoading(false);
    }
  }, []);
 
  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);


  return (
    <DataContext.Provider value={{dark, toggleTheme, dashboardData, dashboardLoading, setDashboardData, refreshDashboardData, socketRef}}>
      {children}
    </DataContext.Provider>
  )
}

export default ContextApiProvider;
