import { useState } from 'react';
import { Phone, MessageCircle, X, Clock, ShieldCheck } from 'lucide-react';

interface SupportWidgetProps {
  externalOpen?: boolean;
  onCloseExternal?: () => void;
}

export function SupportWidget({ externalOpen, onCloseExternal }: SupportWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen || internalOpen;

  const toggle = () => {
    if (isOpen) {
      setInternalOpen(false);
      onCloseExternal?.();
    } else {
      setInternalOpen(true);
    }
  };

  const close = () => {
    setInternalOpen(false);
    onCloseExternal?.();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          role="dialog"
          aria-label="সাহায্য ও সাপোর্ট"
          className="w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 text-left animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-base">E-shop সাপোর্ট</h4>
              <p className="text-xs text-slate-500 mt-0.5">সাহায্য দরকার? সরাসরি কথা বলুন</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="বন্ধ করুন"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2.5">
            <a
              href="https://wa.me/8801700000000?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20E-shop%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp-এ মেসেজ করুন</span>
            </a>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span className="tabular-nums">কল করুন: +880 1700-000000</span>
            </a>
          </div>

          <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#6E8FD4] shrink-0" />
              <span>প্রতিদিন সকাল ১০টা – রাত ১১টা</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E8FD4] shrink-0" />
              <span>১০০% ক্যাশ অন ডেলিভারি সুবিধা</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label="WhatsApp বা সাপোর্টে চ্যাট করুন"
        className="w-14 h-14 rounded-full bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 shadow-lg shadow-emerald-600/25 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#22C55E]"
      >
        {/* Crisp outlined speech bubble with 3 dots matching the user's screenshots */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 5.5C9.925 5.5 5 9.753 5 15c0 2.382 1.015 4.561 2.7 6.23-.23 1.48-.89 2.79-1.91 3.74a.5.5 0 0 0 .35.86c1.92-.05 3.69-.68 5.08-1.64 1.47.46 3.09.71 4.78.71 6.075 0 11-4.253 11-9.5S22.075 5.5 16 5.5Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="11.5" cy="15" r="1.4" fill="#0F172A" />
          <circle cx="16" cy="15" r="1.4" fill="#0F172A" />
          <circle cx="20.5" cy="15" r="1.4" fill="#0F172A" />
        </svg>
      </button>
    </div>
  );
}
