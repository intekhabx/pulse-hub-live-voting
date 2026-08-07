
export function getPollStatus(expiresAt: string, pollCreationStatus: "active" | "draft") {

  let status: "active" | "expired" | "draft";
  const now = new Date(Date.now()).toISOString();
  // console.log(expiresAt, now)
  if(pollCreationStatus === "draft"){
    status = "draft";
  }
  else if(expiresAt > now && pollCreationStatus === "active"){
    status = "active"
  }
  else{
    status = "expired"
  }

  return status;
}