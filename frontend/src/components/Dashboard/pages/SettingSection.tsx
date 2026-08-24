import { useEffect, useState, type FormEvent } from "react";
import tokenStore from "../../../services/tokenStoreService";
import authService from "../../../services/authService";
import toast from "react-hot-toast";
import DeleteButton from "../DeleteButton";
import { useNavigate } from "@tanstack/react-router";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-xs font-semibold text-gray-400 mb-1.5";
const cardCls = "rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.2)]";
const gradientBtn =
  "px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer";
const fontHead = { fontFamily: "'Syne', sans-serif" };
const fontBody = { fontFamily: "'DM Sans', sans-serif" };

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SectionHeader({ icon, title, desc, action }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white" style={fontHead}>{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5" style={fontBody}>{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

const CONNECT_ERROR_MESSAGES: Record<string, string> = {
  already_linked: "That account is already linked to a different PulseHub user.",
  google_already_connected: "Your account is already connected to Google.",
  github_already_connected: "Your account is already connected to GitHub.",
};

function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
      {checks.map(({ label, pass }) => (
        <span
          key={label}
          className={`text-[10px] flex items-center gap-1 transition-colors ${pass ? "text-emerald-400" : "text-gray-600"}`}
          style={fontBody}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            {pass ? (
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
            )}
          </svg>
          {label}
        </span>
      ))}
    </div>
  );
}

export function SettingsSection() {
  const { name, email, isPasswordExists, isGoogleLinked, isGithubLinked } = tokenStore.getUser();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

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

  const sessions = [
    { device: "MacBook Pro · Chrome", location: "Kolkata, IN", current: true },
    { device: "iPhone 15 · Safari", location: "Kolkata, IN", current: false },
    { device: "Windows PC · Edge", location: "Mumbai, IN", current: false },
  ];

  const initials = name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Persist the connect/disconnect result into the stored user object too
  // (tokenStore.getUser() reads from localStorage), so a page refresh keeps
  // showing the correct Connect/Disconnect button instead of resetting to
  // whatever was there at login time.
  const persistConnectionState = (provider: "google" | "github", linked: boolean) => {
    const currentUser = tokenStore.getUser();
    const patch = provider === "google" ? { isGoogleLinked: linked } : { isGithubLinked: linked };
    tokenStore.setUser({ ...currentUser, ...patch });
  };

  // Handle redirect back from the OAuth connect flow — the connect *callback*
  // on the backend still does a plain redirect to
  // /dashboard?section=settings&connected=google|github (or &connect_error=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const connectError = params.get("connect_error");

    if (connected === "google" || connected === "github") {
      setConnections((prev) => ({ ...prev, [connected]: true }));
      persistConnectionState(connected, true);
      toast.success(`${connected === "google" ? "Google" : "GitHub"} account connected successfully`);
    } 
    else if (connectError) {
      toast.error(CONNECT_ERROR_MESSAGES[connectError] || "Couldn't complete the connection. Please try again.");
    }

    if (connected || connectError) {
      params.delete("connected");
      params.delete("connect_error");
      const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

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

  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPassword((prev) => ({ ...prev, [name]: value }));
  };

  const validateNewPassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain at least one special character";
    return null;
  };

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


  // user account deletion
  const handleDeleteUserAccount = async ()=> {
    try {
      await authService.deleteUserAccount();
      toast.success("Account deleted successfully");
      navigate({
        to: "/"
      })
    }  
    catch (error: any) {
      console.log(error);
      toast.error(error?.response.data.message || "Someting went wrong while deleting");
    }
  }

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white" style={fontHead}>Settings</h1>
          <p className="text-sm text-gray-500 mt-1" style={fontBody}>
            Manage your account, security, and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
            {initials || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white" style={fontHead}>{name}</p>
            <p className="text-xs text-gray-500" style={fontBody}>{email}</p>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <form onSubmit={updateUserDetails} className={cardCls}>
          <SectionHeader
            title="Profile"
            desc="Your personal account details"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={fontBody}>Full Name</label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                value={userDetails.name}
                disabled={isSavingProfile}
                className={inputCls}
                style={fontBody}
              />
            </div>
            <div>
              <label className={labelCls} style={fontBody}>Email</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={userDetails.email}
                disabled={isSavingProfile}
                className={inputCls}
                style={fontBody}
              />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button type="submit" disabled={isSavingProfile} className={gradientBtn} style={fontBody}>
              {isSavingProfile ? (
                <>
                  <Spinner /> Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        {/* Security */}
        <form onSubmit={updateUserPassword} className={cardCls}>
          <SectionHeader
            title="Security"
            desc="Update your password regularly"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
          <div className="space-y-4">
            {isPasswordExists ? (
              <div>
                <label className={labelCls} style={fontBody}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  onChange={handlePasswordChange}
                  value={userPassword.currentPassword}
                  placeholder="••••••••"
                  disabled={isSavingPassword}
                  className={inputCls}
                  style={fontBody}
                />
              </div>
            ) : (
              <div className="rounded-xl bg-violet-500/[0.06] border border-violet-500/20 px-4 py-3">
                <p className="text-xs text-violet-300" style={fontBody}>
                  You signed up with Google/GitHub and don't have a password yet. Add one below so you can also sign in with your email.
                </p>
              </div>
            )}
            <div>
              <label className={labelCls} style={fontBody}>New Password</label>
              <input
                type="password"
                name="newPassword"
                onChange={handlePasswordChange}
                value={userPassword.newPassword}
                placeholder="••••••••"
                disabled={isSavingPassword}
                className={inputCls}
                style={fontBody}
              />
              <PasswordRequirements password={userPassword.newPassword} />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button type="submit" disabled={isSavingPassword} className={gradientBtn} style={fontBody}>
              {isSavingPassword ? (
                <>
                  <Spinner /> {isPasswordExists ? "Updating…" : "Adding…"}
                </>
              ) : isPasswordExists ? (
                "Update Password"
              ) : (
                "Add Password"
              )}
            </button>
          </div>
        </form>

        {/* Connected Accounts */}
        <div className={cardCls}>
          <SectionHeader
            title="Connected Accounts"
            desc="Link accounts for faster sign-in"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" stroke="currentColor" strokeWidth="2" />
                <path d="M14.5 9.5L18 6M9.5 14.5L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <div className="space-y-3">
            {[
              { key: "google" as const, label: "Google", sub: "Sign in with your Google account" },
              { key: "github" as const, label: "GitHub", sub: "Sign in with your GitHub account" },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      connections[key] ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200" style={fontBody}>{label}</p>
                    <p className="text-xs text-gray-500" style={fontBody}>{sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnectionClick(key)}
                  disabled={connectingProvider === key}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex-shrink-0 flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                    connections[key]
                      ? "text-rose-400 border border-rose-500/30 hover:bg-rose-500/10"
                      : "text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
                  }`}
                  style={fontBody}
                >
                  {connectingProvider === key ? (
                    <>
                      <Spinner /> Connecting…
                    </>
                  ) : connections[key] ? (
                    "Disconnect"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Plan / Billing */}
        <div className={cardCls}>
          <SectionHeader
            title="Current Plan"
            desc="You're on the Free plan"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            action={
              <button className={gradientBtn} style={fontBody}>Upgrade</button>
            }
          />
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active Polls", val: "3 / 5" },
              { label: "Responses", val: "1.2K" },
              { label: "Team Seats", val: "1 / 1" },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <p className="text-sm font-bold text-white" style={fontHead}>{val}</p>
                <p className="text-[11px] text-gray-500 mt-0.5" style={fontBody}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Sessions — full width */}
        <div className={`${cardCls} lg:col-span-2`}>
          <SectionHeader
            title="Active Sessions"
            desc="Devices currently signed in to your account"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.device}
                className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      s.current ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate" style={fontBody}>
                      {s.device} {s.current && <span className="text-emerald-400 text-xs">· this device</span>}
                    </p>
                    <p className="text-xs text-gray-500" style={fontBody}>{s.location}</p>
                  </div>
                </div>
                {!s.current && (
                  <button className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex-shrink-0" style={fontBody}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone — full width */}
        <div className="lg:col-span-2 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-sm font-bold text-rose-400" style={fontHead}>Danger Zone</h2>
              <p className="text-xs text-gray-500 mt-1" style={fontBody}>
                Once you delete your account, all your polls and data will be permanently removed.
              </p>
            </div>
            <button
              onClick={()=> setShowDeleteButton(true)}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors flex-shrink-0 cursor-pointer"
              style={fontBody}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteButton && 
        <DeleteButton
          isOpen={showDeleteButton}
          label="Are you sure, you want to delete?"
          inputText="delete my account"
          showInput={true}
          onCancel={() => setShowDeleteButton(false)}
          onDelete={handleDeleteUserAccount}
        />
      }
    </div>
  );
}
