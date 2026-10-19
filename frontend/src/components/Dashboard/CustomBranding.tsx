import { useState } from "react";


interface ICustomBrandingProps {
  plan: "FREE" | "PRO" | "PREMIUM",
}

const CustomBranding = ({plan}: ICustomBrandingProps) => {

  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [brandTitle, setBrandTitle] = useState("");
  const [brandDescription, setBrandDescription] = useState("");


  // Free and Pro users see the upgrade prompt
  if (plan !== "PREMIUM") {
    return (
      <section>
        <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
            <svg
              className="h-7 w-7 text-violet-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-white">
            Unlock Custom Branding
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            Upgrade to Premium to add your own logo, brand title,
            and description to your polls.
          </p>

          <button
            type="button"
            // onClick={handleUpgrade}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
          >
            Upgrade to Premium
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>

          <p className="mt-3 text-xs text-gray-500">
            Current plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </p>
        </div>
      </section>
    );
  }

  // Premium users see the branding form
  return (
    <section>
      <div className="rounded-2xl border border-white/[0.07] bg-[#13131f] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Custom Branding
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Personalize your poll with your own branding
            </p>
          </div>
        </div>

        {/* Left image uploader, right text fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Brand Logo / Image
            </label>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];

                if (file && file.type.startsWith("image/")) {
                  setBrandImage(file);
                }
              }}
              className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-8 text-center transition-colors hover:border-violet-500/50 hover:bg-violet-500/[0.03]"
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file && file.type.startsWith("image/")) {
                    setBrandImage(file);
                  }

                  e.target.value = "";
                }}
              />

              {brandImage ? (
                <>
                  <img
                    src={URL.createObjectURL(brandImage)}
                    alt="Brand preview"
                    className="h-24 w-24 rounded-xl border border-white/10 object-contain"
                  />
                  <span className="break-all text-sm text-gray-200">
                    {brandImage.name}
                  </span>
                  <span className="text-xs text-violet-300">
                    Click to replace image
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="h-10 w-10 text-violet-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M12 16V4m-5 5 5-5 5 5" />
                    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                  </svg>

                  <p className="text-sm font-medium text-gray-200">
                    Drag & drop your image here
                  </p>
                  <p className="text-xs text-gray-500">
                    or click to browse files
                  </p>
                  <p className="text-[11px] text-gray-600">
                    PNG, JPG, SVG or WEBP
                  </p>
                </>
              )}
            </label>

            {brandImage && (
              <button
                type="button"
                onClick={() => setBrandImage(null)}
                className="mt-2 text-xs text-red-400 hover:text-red-300"
              >
                Remove image
              </button>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Brand Title
              </label>

              <input
                type="text"
                value={brandTitle}
                onChange={(e) => setBrandTitle(e.target.value)}
                placeholder="Enter your brand title"
                maxLength={80}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
              />

              <p className="mt-1 text-right text-[11px] text-gray-600">
                {brandTitle.length}/80
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Brand Description
              </label>

              <textarea
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                placeholder="Write a short description for your brand..."
                rows={5}
                maxLength={300}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
              />

              <p className="mt-1 text-right text-[11px] text-gray-600">
                {brandDescription.length}/300
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomBranding;
