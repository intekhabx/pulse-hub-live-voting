import { useEffect, useState } from "react";
import { Icons } from "./Icons";

interface DeleteButtonProps {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
  label?: string;
  inputText?: string;
  showInput?: boolean;
  isDeleting?: boolean;
}

export default function DeleteButton({
  isOpen,
  onCancel,
  onDelete,
  label = "Are you sure, you want to delete?",
  inputText,
  showInput = false,
  isDeleting = false,
}: DeleteButtonProps) {
  const [value, setValue] = useState("");

  // Har baar modal khulne par input reset
  useEffect(() => {
    if (isOpen) setValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  // const isMatched = !showInput || value.trim() === label.trim();
  const isMatched = !showInput || value.trim() === inputText?.trim()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isDeleting && onCancel()}
        className="absolute inset-0 bg-[#0a0713]/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-white/10 bg-[#160f28] p-6 shadow-xl">
        {/* Close */}
        <button
          type="button"
          onClick={() => !isDeleting && onCancel()}
          className="absolute right-3 top-3 text-white/40 hover:text-white/80 cursor-pointer"
        >
          {Icons.close}
        </button>

        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/30">
          {Icons.trash}
        </div>

        {/* Label */}
        <p className="w-full text-center text-sm font-medium text-white/80">
          {label}
        </p>

        {showInput && (
        <p className="w-full text-center text-xs font-medium text-slate-200/80">
            <span>Write</span>
            <span className="text-red-400"> "{inputText?.trim()}" </span>
            <span>to delete</span>
          </p>
        )}

        {/* Optional input, matched against label text */}
        {showInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type here..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20"
          />
        )}

        {/* Buttons */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            
            disabled={!isMatched || isDeleting}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-600/40 disabled:text-white/60 cursor-pointer"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * USAGE:
 *
 * const [confirmOpen, setConfirmOpen] = useState(false);
 *
 * <DeleteButton
 *   isOpen={confirmOpen}
 *   label="Are you sure you want to delete this poll?"
 *   inputText="DELETE"
 *   showInput
 *   onCancel={() => setConfirmOpen(false)}
 *   onDelete={() => { deletePoll(id); setConfirmOpen(false); }}
 * />
 */
