import { useNavigate } from "@tanstack/react-router";
import { createContext, useState, type FormEvent } from "react";
import tokenStore from "../services/tokenStoreService";
import authService from "../services/authService";
import toast from "react-hot-toast";
import subscriptionService from "../services/subscriptionService";



type ContextType = {
  showDeleteButton: boolean;
  setShowDeleteButton: React.Dispatch<React.SetStateAction<boolean>>;

  isDeleting: boolean;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  showPaymentSuccess: boolean;
  setShowPaymentSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  purchasedPlan: "PRO" | "PREMIUM";
  setPurchasedPlan: React.Dispatch<React.SetStateAction<"PRO" | "PREMIUM">>;

  userDetails: {name: string, email: string};
  userPassword: {newPassword: string, currentPassword: string};
  connections: {google: boolean, github: boolean};
  setConnections: React.Dispatch<React.SetStateAction<{google: boolean, github: boolean}>>;

  isSavingProfile: boolean;
  isSavingPassword: boolean;
  connectingProvider: "google" | "github" | null;


  handleChange: (e: React.ChangeEvent<HTMLInputElement>)=> void;

  updateUserDetails: (e: FormEvent)=> void;

  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>)=> void;

  updateUserPassword: (e: FormEvent)=> void;

  persistConnectionState: (key: "google" | "github", linked: boolean)=> void;

  handleConnectionClick: (key: "google" | "github")=> void;

  handleExportCSV: ()=> void;

  handleDeleteUserAccount: ()=> void;
}


export const SettingContext = createContext<ContextType | null>(null);



const SettingContextProvider = ({children}: {children: React.ReactNode}) => {

  const storedUser = tokenStore.getUser();
  const {
    name = "",
    email = "",
    isPasswordExists = false,
    isGoogleLinked = false,
    isGithubLinked = false,
  } = storedUser ?? {};


  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState<"PRO" | "PREMIUM">("PRO");

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: name,
    email: email,
  });

  const [userPassword, setUserPassword] = useState({
    newPassword: "",
    currentPassword: "",
  });

  const [connections, setConnections] = useState({
    google: isGoogleLinked,
    github: isGithubLinked,
  });


  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<"google" | "github" | null>(null);


  // function that change the input of userDetials
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };


  // updateUserDetails function
  const updateUserDetails = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await authService.updateUserDetails(userDetails.name, userDetails.email);
      const currentUser = tokenStore.getUser();
      tokenStore.setUser({ ...currentUser, name: userDetails.name, email: userDetails.email });
      toast.success("Your details updated successfully");
    } 
    catch (error: any) {
      console.log(error.response);
      toast.error(error?.response?.data.message || "Failed to update your details");
    } 
    finally {
      setIsSavingProfile(false);
    }
  };

  
  // function that change the input of userPassword
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPassword((prev) => ({ ...prev, [name]: value }));
  };

  // function for validate user password;
  const validateNewPassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain at least one special character";
    return null;
  };


  // updateUserPassword function
  const updateUserPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!userPassword.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (isPasswordExists && !userPassword.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    const passwordError = validateNewPassword(userPassword.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsSavingPassword(true);
    try {
      await authService.updateUserPassword(userPassword.newPassword, userPassword.currentPassword);

      // If the user didn't have a password before, they do now.
      if (!isPasswordExists) {
        const currentUser = tokenStore.getUser();
        tokenStore.setUser({ ...currentUser, isPasswordExists: true });
      }

      toast.success(isPasswordExists ? "Your password has been updated" : "Password added successfully");
      setUserPassword({ newPassword: "", currentPassword: "" });
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data.message || "Password updation failed");
    } 
    finally {
      setIsSavingPassword(false);
    }
  };



  // function that stores google or github connection in localstorage
  const persistConnectionState = (provider: "google" | "github", linked: boolean) => {
    const currentUser = tokenStore.getUser();
    const patch = provider === "google" ? { isGoogleLinked: linked } : { isGithubLinked: linked };
    tokenStore.setUser({ ...currentUser, ...patch });
  };


  // handleConnectionClick function
  const handleConnectionClick = async (key: "google" | "github") => {
    if (connections[key]) {
      // Disconnect
      const ok = confirm(`Are you want to disconnect ${key} account?`);
      if (!ok) return;

      try {
        const res = await authService.disconnectGoogleAndGithub(key);
        setConnections((prev) => ({ ...prev, [key]: false }));
        persistConnectionState(key, false);
        toast.success(res?.data?.message || `${key} account is disconnected successfully`);
      } 
      catch (error: any) {
        console.error(error?.response);
        toast.error(error?.response?.data.message || "Disconnect isn't available yet.");
      }
      return;
    }

    setConnectingProvider(key);
    try {
      // These are authenticated GET requests — the access token goes along
      // via the normal axios interceptor, so the backend can identify the
      // logged-in user and return the correct authorization URL as JSON.
      const url = await authService.getGoogleAndGithubConnectUrl(key);
      window.location.href = url;
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || `Couldn't start ${key === "google" ? "Google" : "GitHub"} connection`);
      setConnectingProvider(null);
    }
  };


  // handle export CSV
  const handleExportCSV = async()=> {
    setIsLoading(true);
    try {
      const res = await subscriptionService.exportAllPollCSV();
  
      const url = window.URL.createObjectURL(res.data);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-polls.csv";
      link.click();
    
      window.URL.revokeObjectURL(url);
      toast.success("Every Poll's data expored");
    } 
    catch (error: any) {
      console.log(error);
      console.log(error.response)
      toast.error(error?.response?.data.message || "Something went wrong while exporting")
    }
    finally{
      setIsLoading(false);
    }
  }


  // user account deletion
  const handleDeleteUserAccount = async ()=> {
    setIsDeleting(true);
    try {
      await authService.deleteUserAccount();
      toast.success("Account deleted successfully");
      navigate({
        to: "/"
      })
    }  
    catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Someting went wrong while deleting");
    }
    finally{
      setIsDeleting(false);
    }
  }
  



  const valueObj = {
    showDeleteButton, setShowDeleteButton, isDeleting, isLoading, setIsLoading,
    showPaymentSuccess, setShowPaymentSuccess, purchasedPlan, setPurchasedPlan,
    userDetails, userPassword, connections, setConnections,
    isSavingProfile, isSavingPassword, connectingProvider,
    handleChange, updateUserDetails, handlePasswordChange, updateUserPassword,
    persistConnectionState, handleConnectionClick, handleExportCSV, handleDeleteUserAccount,
  }

  return (
    <SettingContext.Provider value={valueObj}>
      {children}
    </SettingContext.Provider>
  )
}


export default SettingContextProvider;
