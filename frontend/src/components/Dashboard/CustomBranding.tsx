import { useState, useEffect } from "react";
import subscriptionService from "../../services/subscriptionService";
import toast from "react-hot-toast";

interface ICustomBrandingProps {
  plan: "FREE" | "PRO" | "PREMIUM";
  initialData?: {
    enabled?: boolean;
    brandName?: string;
    brandImage?: string;
    websiteUrl?: string;
    primaryColor?: string;
    footerText?: string;
  };
  onSave?: (data: FormData) => void;
}

const PRESET_COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function CustomBranding({ plan, initialData, onSave }: ICustomBrandingProps) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true);
  const [brandName, setBrandName] = useState(initialData?.brandName || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || "");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#8B5CF6");
  const [footerText, setFooterText] = useState(initialData?.footerText || "");
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.brandImage || "");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brandImage) {
      const url = URL.createObjectURL(brandImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [brandImage]);

  // Upgrade Banner for FREE and PRO users
  if (plan !== "PREMIUM") {
    return (
      <section>
        <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
            <svg className="h-7 w-7 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></svg>
          </div>
          <h2 className="text-lg font-bold text-white">Unlock Custom Branding</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">Upgrade to Premium to add your own logo, brand colors, custom website links, and personalized footer to your polls.</p>
          <button type="button" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500">
            Upgrade to Premium
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </button>
          <p className="mt-3 text-xs text-gray-500">Current plan: {plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()}</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("websiteUrl", websiteUrl);
    formData.append("primaryColor", primaryColor);
    formData.append("footerText", footerText);
    if (brandImage) formData.append("brandImage", brandImage);

    setIsLoading(true);
    try {
      await subscriptionService.uploadCustomBranding(formData);
      toast.success("Branding Updated successfully")
      onSave?.(formData);
    } 
    catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong while uploading");
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        
        {/* Header with Enable Switch */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Custom Branding Settings</h2>
              <p className="mt-0.5 text-xs text-gray-400">Personalize your public polls with your organization's brand identity</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-medium text-gray-300">{enabled ? "Branding Active" : "Branding Disabled"}</span>
            <button type="button" role="switch" aria-checked={enabled} onClick={() => setEnabled(!enabled)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${enabled ? "bg-violet-600" : "bg-gray-700"}`}>
              <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </label>
        </div>

        {/* Form Body */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Left Column: Logo Uploader */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">Brand Logo / Icon</label>
            <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file?.type.startsWith("image/")) setBrandImage(file); }} className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-8 text-center transition-colors hover:border-violet-500/50 hover:bg-violet-500/[0.03]">
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file?.type.startsWith("image/")) setBrandImage(file); e.target.value = ""; }} />

              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Brand preview" className="h-20 w-20 rounded-xl border border-white/10 object-contain bg-black/20 p-2" />
                  <span className="break-all text-xs text-gray-200">{brandImage ? brandImage.name : "Current uploaded logo"}</span>
                  <span className="text-xs text-violet-400 hover:underline">Click or drag to replace logo</span>
                </>
              ) : (
                <>
                  <svg className="h-9 w-9 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
                  <p className="text-sm font-medium text-gray-200">Drag & drop your logo here</p>
                  <p className="text-xs text-gray-500">or click to browse from device</p>
                  <p className="text-[11px] text-gray-600">PNG, JPG, SVG or WEBP (Max 2MB)</p>
                </>
              )}
            </label>

            {previewUrl && (
              <button type="button" onClick={() => { setBrandImage(null); setPreviewUrl(""); }} className="mt-2 text-xs text-red-400 hover:text-red-300">Remove logo</button>
            )}
          </div>

          {/* Right Column: Inputs Matching Mongoose Schema */}
          <div className="flex flex-col gap-4">
            
            {/* Brand Name */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">Brand Name</label>
                <span className="text-[11px] text-gray-500">{brandName.length}/50</span>
              </div>
              <input type="text" maxLength={50} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20" />
            </div>

            {/* Primary Theme Color */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-300">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1" />
                <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#8B5CF6" className="w-28 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-mono text-gray-200 outline-none focus:border-violet-500/50" />
                
                {/* Preset Swatches */}
                <div className="flex items-center gap-1.5">
                  {PRESET_COLORS.map((color) => (
                    <button key={color} type="button" style={{ backgroundColor: color }} onClick={() => setPrimaryColor(color)} className={`h-6 w-6 rounded-full border border-white/20 transition-transform ${primaryColor.toUpperCase() === color ? "scale-125 ring-2 ring-white" : "hover:scale-110"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">Website URL</label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20" />
            </div>

            {/* Footer Text */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">Custom Footer Copyright Text</label>
                <span className="text-[11px] text-gray-500">{footerText.length}/150</span>
              </div>
              <textarea rows={2} maxLength={150} value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="© 2026 Acme Corp. All rights reserved." className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20" />
            </div>

          </div>
        </div>

        {/* Submit Footer */}
        <div className="mt-6 flex justify-end border-t border-white/[0.06] pt-4">
          <button type="submit" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:opacity-90">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            {isLoading ? "Uploading...": "Save Branding Changes"}
          </button>
        </div>

      </form>
    </section>
  );
}