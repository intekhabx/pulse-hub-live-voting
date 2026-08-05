import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { IActivityItem, IDashboard } from "../components/Dashboard/assets/types";
import responseService from "../services/responseService";
import pollService from "../services/pollService";
import { DataContext } from "./ContextApi";


type ContextType = {
  dashboardData: IDashboard | undefined,
  dashboardLoading: boolean,
  recentActivity: IActivityItem[],
  fetchDashboardData: () => Promise<void>,
}

export const PollContext = createContext<ContextType | null>(null);



const PollContextProvider = ({children}: PropsWithChildren)=> {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("user should be defined inside the ContextApiProvider");
  }
  const {user, socketRef} = context;


  // overview section data****
  const [dashboardData, setDashboardData] = useState<IDashboard>();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<IActivityItem[]>([]);
  
  const fetchDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await responseService.getDashboardData();
      setDashboardData(res.data);
    } 
    catch (error) {
      // A guest session cannot access dashboard data; it is fetched again after login.
      setDashboardData(undefined);
    } 
    finally {
      setDashboardLoading(false);
    }
  }, []);


  const fetchRecentActivity = useCallback(async()=> {
    try {
      const res = await pollService.getRecentActivity();
      setRecentActivity(res?.data);
    } 
    catch (error) {
      setRecentActivity([]);
    }
  }, []);


  useEffect(() => {
    const loadOverviewData = async()=>{
      await Promise.all([ //iif we don't use promse then it call one by one, but in promise.all it called parallel
        fetchDashboardData(),
        fetchRecentActivity(),
      ])
    }
    loadOverviewData();
  }, [user, fetchDashboardData, fetchRecentActivity]);
  


  useEffect(() => {
    socketRef.current?.on("server:poll-updated", (data)=> {
      console.log(data);
      setDashboardData((prev)=> prev ? {...prev, totalResponses: prev.totalResponses + 1} : prev);
    })
  
    socketRef.current?.on("server:poll-created", ()=> {
      fetchDashboardData();
    })
    socketRef.current?.on("server:poll-deleted", fetchDashboardData);
  }, [])
  


  // pollSection*****


  return(
    <PollContext.Provider value={{dashboardData, dashboardLoading, recentActivity, fetchDashboardData,}}>
      {children}
    </PollContext.Provider>
  )
}

export default PollContextProvider;
