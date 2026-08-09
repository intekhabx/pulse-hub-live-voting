import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { IActivityItem, IAnalyticsPageData, IDashboard, IPoll, IPollResponse } from "../components/Dashboard/assets/types";
import responseService from "../services/responseService";
import pollService from "../services/pollService";
import { DataContext } from "./ContextApi";
import toast from "react-hot-toast";


type ContextType = {
  // overview section***
  dashboardData: IDashboard | undefined,
  dashboardLoading: boolean,
  recentActivity: IActivityItem[],
  fetchDashboardData: () => Promise<void>,

  // pollSection***
  polls: IPoll[],
  totalPollResponse: IPollResponse[],
  isLoading: boolean,
  handleDelete: (pollId: string)=> void,

  // analyticsPageSection***
  pollResponse: IAnalyticsPageData | null,
  error: string | null,
  getAnalyticsPageData: ()=> void,

}

export const PollContext = createContext<ContextType | null>(null);



const PollContextProvider = ({children}: PropsWithChildren)=> {

  const context = useContext(DataContext);
  if(!context){
    throw new Error("user should be defined inside the ContextApiProvider");
  }
  const {user, socketRef, socketReady} = context;


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
    if(!socketReady || !socketRef.current) return;

    socketRef.current?.on("server:poll-updated", (data)=> {
      console.log(data);
      // update the totalResponse by one
      setDashboardData((prev)=> prev ? {...prev, totalResponses: prev.totalResponses + 1} : prev);
      // update the recent_activity (by refetching)
      fetchRecentActivity();
    })
  
    socketRef.current?.on("server:poll-created", ()=> {
      fetchDashboardData();
      fetchRecentActivity();
    })
    socketRef.current?.on("server:poll-deleted", ()=> {
      fetchDashboardData();
      fetchRecentActivity();
    });
    socketRef.current?.on("server:poll-expired", fetchRecentActivity);
  }, [socketReady]);
  


  // pollSection*****
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [totalPollResponse, setTotalPollResponse] = useState<IPollResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  
  const getMyPolls = async () => {
    try {
      setIsLoading(true);
      const res = await pollService.getMyPolls();
      const { polls, pollResponse } = res.data;
      setPolls(polls);
      setTotalPollResponse(pollResponse);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(!user) return;

    getMyPolls();
  }, [user]);


  // whenever poll is updated, update the all responses
  useEffect(() => {
    if(!socketReady || !socketRef.current) return;

    socketRef.current?.on("server:poll-updated", (data) => {
      setTotalPollResponse((prev) =>
        prev?.map((item) => (item.pollId === data.pollId ? { ...item, totalResponse: data.totalResponseCount } : item))
      );
    });

    socketRef.current?.on("server:poll-created", ()=> {
      getMyPolls();
    })
  }, [socketReady]);


  // handleDelete for deleting the polls
  const handleDelete = async(pollId: string)=> {
    const ok = confirm("do you want to delete this poll");
    if(!ok){
      return;
    }

    setIsLoading(true);
    try {
      await pollService.deletePollById(pollId);
      toast.success("Poll Deleted Successfully");

      // remove deleted poll from the pollsection
      setPolls((prev = []) =>
        prev.filter((poll) => poll._id !== pollId)
      );
      // remove deleted responsed of that poll
      setTotalPollResponse((prev = []) => 
        prev.filter((response) => response.pollId !== pollId)
      );
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error.message || "something went wrong");
    }
    finally{
      setIsLoading(false);
    }
  }



  // analyticsPageSection*****
  const [pollResponse, setPollResponse] = useState<IAnalyticsPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAnalyticsPageData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pollService.getAnalyticsPageData();
      setPollResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(!user) return;

    getAnalyticsPageData();
  }, [user]);

  
  // io totalResponse updation
  useEffect(()=> {
    if(!socketReady || !socketRef.current) return;

    socketRef.current?.on("server:poll-updated", (data) => {
      setPollResponse((prev) => {
        if (!prev) return prev;
    
        return {
          ...prev,
          pollResponses: prev.pollResponses.map((p) => p.pollId === data.pollId ? {...p, totalVoteCount: data.totalResponseCount} : p),
        };
      });
    });

    socketRef.current.on("server:poll-created", getAnalyticsPageData);
    socketRef.current?.on("server:poll-deleted", getAnalyticsPageData);
  }, [socketReady]);


  // temperory basis code io code of pollDetailsSection and viewAndEditPollSection
  useEffect(()=> {
    if(!socketReady || !socketRef.current) return;

    socketRef.current.on("server:poll-published", ()=> {
      fetchRecentActivity();
      getMyPolls();
    })

    socketRef.current.on("server:poll-edited", ()=> {
      fetchRecentActivity();
      getMyPolls();
    })
  }, [socketReady])



  const valueObj = {
    // overview section***
    dashboardData, dashboardLoading, recentActivity, fetchDashboardData,
    // overview section***
    polls, totalPollResponse, isLoading, handleDelete,
    // analytics page section***
    pollResponse, error, getAnalyticsPageData,
  }

  return(
    <PollContext.Provider value={valueObj}>
      {children}
    </PollContext.Provider>
  )
}

export default PollContextProvider;
