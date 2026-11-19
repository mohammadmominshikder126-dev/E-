import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="শপিং কার্ট"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#2563EB]" />
            <h2 className="font-bold text-slate-900 text-lg">
              আপনার কার্ট ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="কার্ট বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-800 text-base">আপনার কার্ট খালি</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                পছন্দের গ্যাজেট কার্টে যোগ করুন অথবা সরাসরি &ldquo;অর্ডার করুন&rdquo; বাটনে ক্লিক করুন।
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold cursor-pointer"
              >
                কেনাকাটা চালিয়ে যান
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex gap-3.5 p-3 rounded-xl border border-slate-200 bg-white"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#6E8FD4] text-sm truncate">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.variant.label}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.key)}
                      aria-label={`${item.product.name} সরান`}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#2563EB] text-base tabular-nums">
                      ৳{item.unitPrice * item.quantity}
                    </span>

                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.key, -1)}
                        aria-label="পরিমাণ কমান"
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.key, 1)}
                        aria-label="পরিমাণ বাড়ান"
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>পণ্যের মোট মূল্য</span>
              <span className="font-bold text-slate-900 text-lg tabular-nums">
                ৳{subtotal}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ক্যাশ অন ডেলিভারি সুবিধা • ডেলিভারি চার্জ অর্ডার ফর্মে যুক্ত হবে
            </p>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
