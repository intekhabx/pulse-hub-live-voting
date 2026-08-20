import { useState, type FormEvent } from "react";
import tokenStore from "../../../services/tokenStoreService";
import authService from "../../../services/authService";
import toast from "react-hot-toast";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.03] border border-white/[0.08] outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all";
const labelCls = "block text-xs font-semibold text-gray-400 mb-1.5";
const cardCls = "rounded-2xl border border-white/[0.07] bg-[#13131f] p-6";
const gradientBtn =
  "px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all";
const fontHead = { fontFamily: "'Syne', sans-serif" };
const fontBody = { fontFamily: "'DM Sans', sans-serif" };

function SectionHeader({
  icon,
  title,
  desc,
  action,
}: {
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



export function SettingsSection() {
  const { name, email, isPasswordExists, isGoogleLinked, isGithubLinked } = tokenStore.getUser();

  const [userDetails, setUserDetails] = useState({
    name: name,
    email: email
  });

  const [userPassword, setUserPassword] = useState({
    newPassword: "",
    currentPassword: ""
})


  const [connections, setConnections] = useState({
    google: isGoogleLinked,
    github: isGithubLinked,
  });
  const toggleConnection = (key: keyof typeof connections) =>
    setConnections((c) => ({ ...c, [key]: !c[key] }));

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

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    const {name, value} = e.target;
    setUserDetails((prev) => ({...prev, [name]: value}));
  }

  const updateUserDetails = async(e: FormEvent)=>{
    e.preventDefault();
    try {
      await authService.updateUserDetails(userDetails.name, userDetails.email);
      toast.success("Your details updated successfully");
    } 
    catch (error: any) {
      console.log(error.response);
      toast.error(error?.response?.data.message || "Failed to update your details");
    }
  }


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    const {name, value} = e.target;
    setUserPassword((prev)=> ({...prev, [name]: value}));
  }

  const updateUserPassword = async(e: FormEvent)=>{
    e.preventDefault();
    try {
      await authService.updateUserPassword(userPassword.newPassword, userPassword.currentPassword);
      toast.success("Your Password has been updated");
      setUserPassword({newPassword: "", currentPassword: ""});
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data.message || "Password updation failed");
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
              <input onChange={handleChange} type="text" name="name" value={userDetails.name}  className={inputCls} style={fontBody} />
            </div>
            <div>
              <label className={labelCls} style={fontBody}>Email</label>
              <input onChange={handleChange} type="email" name="email" value={userDetails.email} className={inputCls} style={fontBody} />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button type="submit" className={gradientBtn} style={fontBody}>Save Changes</button>
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
            {
              isPasswordExists ?
              <div>
                <label className={labelCls} style={fontBody}>Current Password</label>
                <input type="password" name="currentPassword" onChange={handlePasswordChange} value={userPassword.currentPassword} placeholder="••••••••" className={inputCls} style={fontBody} />
              </div>
              : <div className="text-white">Add Your Custom Password</div>
            }
            <div>
              <label className={labelCls} style={fontBody}>New Password</label>
              <input type="password" name="newPassword" onChange={handlePasswordChange} value={userPassword.newPassword} placeholder="••••••••" className={inputCls} style={fontBody} />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button onSubmit={updateUserPassword} className={gradientBtn} style={fontBody}>{isPasswordExists ? "Update Password" : "Add Password"}</button>
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
              { key: "github" as const, label: "Github", sub: "Sign in with your Gmail account" },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200" style={fontBody}>{label}</p>
                  <p className="text-xs text-gray-500" style={fontBody}>{sub}</p>
                </div>
                <button
                  onClick={() => toggleConnection(key)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    connections[key]
                      ? "text-rose-400 border border-rose-500/30 hover:bg-rose-500/10"
                      : "text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
                  }`}
                  style={fontBody}
                >
                  {connections[key] ? "Disconnect" : "Connect"}
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
              className="px-5 py-2 rounded-xl text-sm font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors flex-shrink-0"
              style={fontBody}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}