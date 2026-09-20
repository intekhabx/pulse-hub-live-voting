import { useContext, useEffect } from "react";
import authService from "../../services/authService";
import { DataContext } from "../../Context/ContextApi";

interface PaymentSuccessModalProps {
  open: boolean;
  plan: "PRO" | "PREMIUM";
  onClose: () => void;
}

const PLAN_DETAILS = {
  PRO: { name: "Pro" },
  PREMIUM: { name: "Premium" },
};

export default function PaymentSuccessModal({open, plan, onClose}: PaymentSuccessModalProps) {
  const planDetails = PLAN_DETAILS[plan];
  const isPremium = plan === "PREMIUM";


  const context = useContext(DataContext)
  if(!context){
    throw new Error("setAuthUser should be defined inside DataContext");
  }
  const {setAuthUser} = context;

  // function that update the user details after the subsripton
  useEffect(() => {
    const getUserDetails = async () => {
      const res = await authService.getUserDetails();
      setAuthUser(res.data.user);
    }
    getUserDetails();
  }, []);


  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-7 shadow-2xl ${
          isPremium
            ? "border-[#d4a72c]/30 bg-[#17140f] dark:border-[#d4a72c]/30 dark:bg-[#17140f]"
            : "border-black/10 bg-white dark:border-white/10 dark:bg-[#111111]"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition ${
            isPremium
              ? "text-[#a99b7a] hover:bg-[#d4a72c]/10 hover:text-[#f5c84b]"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
          }`}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ring-8 ${
              isPremium
                ? "bg-[#d4a72c]/10 text-[#f5c84b] ring-[#d4a72c]/5"
                : "bg-green-500/10 text-green-500 ring-green-500/5 dark:bg-green-400/10"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            {/* Sparkles */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-[18px] w-[18px] ${
                isPremium ? "text-[#f5c84b]" : "text-violet-500"
              }`}
            >
              <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z" />
              <path d="m19 14-.75 2.25L16 17l2.25.75L19 20l.75-2.25L22 17l-2.25-.75L19 14Z" />
              <path d="m5 4-.5 1.5L3 6l1.5.5L5 8l.5-1.5L7 6l-1.5-.5L5 4Z" />
            </svg>

            <span
              className={`text-sm font-medium ${
                isPremium
                  ? "text-[#f5c84b]"
                  : "text-violet-600 dark:text-violet-400"
              }`}
            >
              Welcome to PulseHub {planDetails.name}
            </span>

            {/* Sparkles */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-[18px] w-[18px] ${
                isPremium ? "text-[#f5c84b]" : "text-violet-500"
              }`}
            >
              <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z" />
              <path d="m19 14-.75 2.25L16 17l2.25.75L19 20l.75-2.25L22 17l-2.25-.75L19 14Z" />
              <path d="m5 4-.5 1.5L3 6l1.5.5L5 8l.5-1.5L7 6l-1.5-.5L5 4Z" />
            </svg>
          </div>

          <h2
            className={`text-2xl font-semibold tracking-tight ${
              isPremium
                ? "text-[#f5e7b2]"
                : "text-gray-900 dark:text-white"
            }`}
          >
            You're officially upgraded! 🎉
          </h2>

          <p
            className={`mt-3 text-sm leading-6 ${
              isPremium
                ? "text-[#a99b7a]"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Thank you for choosing PulseHub. Your{" "}
            <span
              className={`font-semibold ${
                isPremium
                  ? "text-[#f5e7b2]"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {planDetails.name}
            </span>{" "}
            plan is now active.
          </p>
        </div>

        {/* Plan Card */}
        <div
          className={`mt-6 rounded-xl border p-4 ${
            isPremium
              ? "border-[#d4a72c]/20 bg-[#d4a72c]/5"
              : "border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-medium uppercase tracking-wider ${
                  isPremium
                    ? "text-[#8f835f]"
                    : "text-gray-500 dark:text-gray-500"
                }`}
              >
                Current Plan
              </p>

              <p
                className={`mt-1 text-base font-semibold ${
                  isPremium
                    ? "text-[#f5e7b2]"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                PulseHub {planDetails.name}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`text-xs ${
                  isPremium
                    ? "text-[#f5c84b]"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
            isPremium
              ? "bg-[#d4a72c] text-[#17140f] hover:bg-[#e0b83d]"
              : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          }`}
        >
          Continue to PulseHub
        </button>

        <p
          className={`mt-3 text-center text-xs ${
            isPremium ? "text-[#756b51]" : "text-gray-400"
          }`}
        >
          You can manage your subscription anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
