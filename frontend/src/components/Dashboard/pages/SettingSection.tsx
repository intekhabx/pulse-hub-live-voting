import tokenStore from "../../services/tokenStoreService";


export function SettingsSection() {
  const {name, email} = tokenStore.getUser();
  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-violet-500/50 transition-all";
  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Manage your account preferences</p>
      </div>
      {[
        { title: "Profile", fields: [{ label: "Full Name", val: name, type: "text" }, { label: "Email", val: email, type: "email" }] },
        { title: "Security", fields: [{ label: "Current Password", val: "", type: "password" }, { label: "New Password", val: "", type: "password" }] },
      ].map(({ title, fields }) => (
        <div key={title} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>
          {fields.map(({ label, val, type }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
              <input type={type} defaultValue={val} className={inputCls} style={{ fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          ))}
          <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Save Changes
          </button>
        </div>
      ))}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <h2 className="text-sm font-bold text-rose-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Once you delete your account, all your polls and data will be permanently removed.</p>
        <button className="px-5 py-2 rounded-xl text-sm font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}