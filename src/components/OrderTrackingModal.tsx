import { useState, FormEvent } from 'react';
import { X, Truck, Search, PackageCheck } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderTrackingModalProps {
  orders: OrderRecord[];
  onClose: () => void;
}

export function OrderTrackingModal({ orders, onClose }: OrderTrackingModalProps) {
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(
    orders[0] || null
  );
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim().replace(/^#/, '').toLowerCase();
    if (!cleaned) return;
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === cleaned ||
        o.phone.toLowerCase().includes(cleaned)
    );
    if (match) {
      setSearchedOrder(match);
      setNotFound(false);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="অর্ডার ট্র্যাকিং"
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#6E8FD4]" />
            <h2 className="font-bold text-slate-900 text-lg">অর্ডার ট্র্যাক করুন</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="অর্ডার আইডি (PG-...) বা মোবাইল নম্বর"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold cursor-pointer shrink-0"
            >
              খুঁজুন
            </button>
          </form>

          {notFound && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 text-center">
              এই আইডি বা মোবাইল নম্বরে কোনো অর্ডার পাওয়া যায়নি।
            </div>
          )}

          {searchedOrder ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2563EB] tabular-nums">
                  #{searchedOrder.id}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <PackageCheck className="w-4 h-4" />
                  {searchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{searchedOrder.createdAt}</p>
              <div className="text-sm text-slate-700 space-y-1 border-t border-slate-200 pt-2">
                <p>
                  <span className="text-slate-500">গ্রাহক:</span> {searchedOrder.customerName}
                </p>
                <p>
                  <span className="text-slate-500">ঠিকানা:</span> {searchedOrder.address}
                </p>
                <p>
                  <span className="text-slate-500">মোট:</span>{' '}
                  <span className="font-bold text-[#2563EB] tabular-nums">
                    ৳{searchedOrder.total}
                  </span>{' '}
                  (ক্যাশ অন ডেলিভারি)
                </p>
              </div>
            </div>
          ) : (
            !notFound && (
              <div className="py-6 text-center text-sm text-slate-500">
                আপনি এখনও কোনো অর্ডার করেননি। অর্ডার করলে এখানে ট্র্যাকিং তথ্য দেখতে পাবেন।
              </div>
            )
          )}

          {orders.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-600">সাম্প্রতিক অর্ডারসমূহ:</p>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 4).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setSearchedOrder(o);
                      setNotFound(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer tabular-nums ${
                      searchedOrder?.id === o.id
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    #{o.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
