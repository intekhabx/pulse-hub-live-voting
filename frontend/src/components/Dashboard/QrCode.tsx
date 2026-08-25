import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Icons } from "./Icons";

type QrCodeProps = {
  pollId: string;
  isOpen: boolean;
  onCancel: () => void;
};

function QrCode({ pollId, isOpen, onCancel }: QrCodeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const value = `${import.meta.env.VITE_BASE_URL}/votes/${pollId}`;

  const handleDownload = () => {
    // find the canvas
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
  
    // downloadable image size
    const padding = 16;
    const border = 1;
    const radius = 12;
  
    // creating a blank canvas in browser memory
    const output = document.createElement("canvas");
    output.width = canvas.width + padding * 2;
    output.height = canvas.height + padding * 2;
  
    const ctx = output.getContext("2d");
    if (!ctx) return;
  
    // White rounded box
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(
      0,
      0,
      output.width,
      output.height,
      radius
    );
    ctx.fill();
  
    // Fuchsia border
    ctx.strokeStyle = "#d946ef";
    ctx.lineWidth = border;
    ctx.beginPath();
    ctx.roundRect(
      border / 2,
      border / 2,
      output.width - border,
      output.height - border,
      radius
    );
    ctx.stroke();
  
    // QR adding
    ctx.drawImage(
      canvas,
      padding,
      padding,
      canvas.width,
      canvas.height
    );
  
    // Download
    const link = document.createElement("a");
    link.href = output.toDataURL("image/png");
    link.download = `poll-${pollId}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-[#0a0713]/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-white/10 bg-[#160f28] p-6 shadow-xl cursor-pointer">
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 text-white/40 hover:text-white/80"
        >
          {Icons.close}
        </button>

        {/* Heading */}
        <p className="w-full text-center text-sm font-medium text-white/80">
          Scan to vote on this poll
        </p>

        {/* QR code */}
        <div
          ref={wrapperRef}
          className="rounded-xl border border-fuchsia-500/30 bg-white p-4 shadow-[0_0_30px_rgba(217,70,239,0.15)]"
          >
          <QRCodeCanvas
            value={value}
            size={220}
            bgColor="#ffffff"
            fgColor="#160f28"
            level="H" //4 level hote h ye highest level h thoda qr blur hone pe v sahi se work krega
            imageSettings={{
              src: "./favicon.svg",
              height: 42,
              width: 42,
              excavate: true,
            }}
          />
        </div>

        {/* Link preview */}
        <p className="w-full truncate text-center text-xs text-white/40">
          {value}
        </p>

        {/* Buttons */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-500 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}

export default QrCode;

/**
 * USAGE:
 *
 * const [qrOpen, setQrOpen] = useState(false);
 *
 * <QrCode
 *   pollId={poll.id}
 *   isOpen={qrOpen}
 *   onCancel={() => setQrOpen(false)}
 * />
 */
