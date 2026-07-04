
export function getPollStatus(expiresAt: string) {

  let status: "active" | "expired";
  const now = new Date(Date.now()).toISOString();
  // console.log(expiresAt, now)
  if(expiresAt > now){
    status = "active"
  }else{
    status = "expired"
  }

  return status;
}