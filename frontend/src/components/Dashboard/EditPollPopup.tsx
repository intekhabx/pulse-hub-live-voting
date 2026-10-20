import { useEffect, useState, type FormEvent } from "react";
import pollService from "../../services/pollService";
import toast from "react-hot-toast";

interface IEditPollPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    title: string;
    description: string;
    expiresAt: string;
    allowAnonymous: boolean;
  }) => void;
  poll: {
    pollId: string,
    title: string;
    description: string;
    expiresAt: string;
    allowAnonymous?: boolean;
  };
}

export default function EditPollPopup({ isOpen, onClose, onSubmit, poll }: IEditPollPopupProps) {

  const toLocalDateTime = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: poll?.title || "",
    description: poll?.description || "",
    expiresAt: toLocalDateTime(poll?.expiresAt || ""),
    allowAnonymous: poll?.allowAnonymous ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: poll?.title || "",
        description: poll?.description || "",
        expiresAt: toLocalDateTime(poll?.expiresAt || ""),
        allowAnonymous: poll?.allowAnonymous ?? true,
      });
    }
  }, [isOpen, poll]);

  if (!isOpen) return null;

  
  const setExpiryDays = (days: number) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    setFormData((prev) => ({ ...prev, expiresAt: toLocalDateTime(expiry.toISOString()) }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await pollService.updateActivePollBasicDetails(poll.pollId, formData);
      toast.success("Poll updated successfully");
      onSubmit(formData);
    } 
    catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data.message || "Something went wrong while updating")
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800/80 bg-[#0d0f17] p-6 sm:p-8 text-slate-200 shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-900/40 text-purple-400 border border-purple-500/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Poll Details</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Input */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
              <label className="font-semibold text-slate-200">Poll Title <span className="text-purple-400">*</span></label>
              <span className="text-slate-500">{formData.title.length}/120</span>
            </div>
            <input type="text" required maxLength={120} value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} placeholder="e.g. Team Feedback Survey" className="w-full rounded-xl border border-slate-800 bg-[#131722] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50" />
          </div>

          {/* Description Input */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
              <label className="font-semibold text-slate-200">Description (optional)</label>
              <span className="text-slate-500">{formData.description.length}/300</span>
            </div>
            <textarea rows={3} maxLength={300} value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} placeholder="Add context for your respondents..." className="w-full resize-none rounded-xl border border-slate-800 bg-[#131722] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50" />
          </div>

          {/* Expires At & Response Mode Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Expires At */}
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-200">Expires At</label>
              <div className="relative">
                <input type="datetime-local" required min={toLocalDateTime(new Date().toISOString())} value={formData.expiresAt} onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#131722] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-purple-500/50 [color-scheme:dark]" />
              </div>

              {/* Day Selection Pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 7].map((days) => (
                  <button key={days} type="button" onClick={() => setExpiryDays(days)} className="rounded-full border border-purple-500/30 bg-purple-950/30 px-3.5 py-1 text-xs font-medium text-purple-300 transition hover:bg-purple-900/50 hover:text-white">
                    {days} {days === 1 ? "day" : "days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Mode Segmented Switch */}
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-200">Response Mode</label>
              <div className="flex h-[46px] items-center rounded-xl border border-slate-800 bg-[#131722] p-1">
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, allowAnonymous: true }))} className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${formData.allowAnonymous ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-purple-500/20" : "text-slate-400 hover:text-slate-200"}`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.982-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" /></svg>
                  Anonymous
                </button>

                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, allowAnonymous: false }))} className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${!formData.allowAnonymous ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-purple-500/20" : "text-slate-400 hover:text-slate-200"}`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Authenticated
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-800 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">Cancel</button>
            <button type="submit" disabled={isLoading} className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:opacity-90 cursor-pointer">{isLoading ? "Saving...": "Save Changes"}</button>
          </div>

        </form>
      </div>
    </div>
  );
}
