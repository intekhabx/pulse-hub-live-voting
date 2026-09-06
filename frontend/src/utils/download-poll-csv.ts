import toast from "react-hot-toast";
import type { IPollAnalytics } from "../components/Dashboard/assets/types";
import subscriptionService from "../services/subscriptionService";
import tokenStore from "../services/tokenStoreService";


// function that change the ," and \n into ""(double quotes) so csv file dones't confuse
const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};



const convertPollAnalyticsIntoCSV = (pollAnalytics: IPollAnalytics) => {
  // step:1 - create the header(top_column_name) for the csv table
  const headers = [ "pollId", "title", "description", "createdAt", "totalResponseCount", "authenticatedUserCount", "anonymousUserCount", "authenticatedPercentage", "anonymousPercentage", "questionId", "question", "totalVotes", "optionId", "optionText", "votes", "percentage", ];

  // step:2 - create rows for the csv table
  const rows: string[][] = []; 
  
  for (const ques of pollAnalytics.analytics) { 
    for (const opt of ques.options) { 
      rows.push([ 
        String(pollAnalytics.pollId),
        pollAnalytics.title,
        pollAnalytics.description,
        pollAnalytics.createdAt.split("T")[0],
        String(pollAnalytics.totalResponseCount), 
        String(pollAnalytics.authenticatedUserCount), 
        String(pollAnalytics.anonymousUserCount), 
        String(pollAnalytics.authenticatedPercentage), 
        String(pollAnalytics.anonymousPercentage), 
        
        String(ques._id), 
        ques.question, 
        String(ques.totalVotes), 

        String(opt.optionId), 
        opt.optionText, 
        String(opt.votes), 
        String(opt.percentage), 
      ]); 
    } 
  }

  // step:3 - join the header with , (comma seperated) and rows eachvalue with , 
  return [ 
    headers.map(escapeCSV).join(","), 
    ...rows.map((row) => 
      row.map(escapeCSV).join(",")), 
  ].join("\n");
}



export async function downloadPollCSV(pollAnalytics: IPollAnalytics){
  try {
    // step:1 - check the user has free, pro or premium plan
    const {plan} = tokenStore.getUser();
    if(plan === "FREE"){
      toast.error("upgrade your plan");
      return;
    }

    // step:2 - check from the backend that only pro and premium user can download it
    const res = await subscriptionService.canFreeUserUseService();
    console.log(res.data);
    
    if(!res.data){
      toast.error("upgrade you plan");
      return;
    }

    // step:3 - now the user is (pro or premium) so convert poll analytics into csv file
    const csv = convertPollAnalyticsIntoCSV(pollAnalytics);
    
    // step:4 - Create a Blob
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
  
    // step:5 - Create temporary download URL
    const url = URL.createObjectURL(blob);
  
    // step:6 - Create download link with anchor tag
    const link = document.createElement("a");
    link.href = url;
    link.download = `poll-${pollAnalytics.pollId}.csv`;
  
    // step:7 - Trigger download
    link.click();
  
    // step:8 - Cleanup
    URL.revokeObjectURL(url);
    
  } 
  catch (error: any) {
    console.log(error.response.data.message);
    toast.error("upgrade your plan");
    return;
  }
}
