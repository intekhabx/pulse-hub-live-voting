import toast from "react-hot-toast";
import subscriptionService from "../services/subscriptionService";


// here we declare that global has Razorpay for type safe
declare global {
  interface Window {
    Razorpay: any;
  }
}


// this function add razorpay url in the body
const loadRazorpay = () => {
  return new Promise<boolean>((resolve) => {
    // if window object has already Razorpay then resolve as true
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // if not then create a script and add src
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};



export const handleUpgrade = async (plan: "PRO" | "PREMIUM", onSuccess: (plan: "PRO" | "PREMIUM")=> void) => {
  try {
    // step;1 - check the razor pay script is added in body or not
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay failed to load, Please try after sometime")
      throw new Error("Razorpay SDK failed to load");
    }

    // step:2 - get the response of the created subscription from server
    const response = await subscriptionService.createSubscription(plan);

    const {razorpayKeyId, razorpaySubscriptionId} = response.data;

    // step:3 - create options for the razorpay window page
    const options = {
      key: razorpayKeyId,
      subscription_id: razorpaySubscriptionId,
      name: "PulseHub",
      description: `PulseHub ${plan} Subscription`,
      handler: async () => {
        // payment model complete hone ke baad user yahan aata h (YE CODE RUN HOTA H)
        toast.success("Payment completed");
        onSuccess(plan);
      },
      theme: {
        color: "#000000",
      },
    };

    // step:4 - create new razorpay window with options and open it
    const razorpay = new window.Razorpay(options);
    razorpay.open(); //open razorpay pop window
  } 
  catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong")
    console.error(error);
  }
};
