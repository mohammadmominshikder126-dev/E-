import { useState, FormEvent } from 'react';
import { X, CheckCircle2, Truck, Banknote, MapPin, Phone, User } from 'lucide-react';
import { CartItem, OrderRecord } from '../types';

interface CheckoutModalProps {
  items: CartItem[];
  onClose: () => void;
  onOrderConfirmed: (order: OrderRecord) => void;
}

export function CheckoutModal({
  items,
  onClose,
  onOrderConfirmed,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryZone === 'inside_dhaka' ? 60 : 120;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s|-/g, '');
    if (customerName.trim().length < 2) {
      setError('দয়া করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      setError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (address.trim().length < 6) {
      setError('দয়া করে আপনার ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    setError('');
    const orderId = `PG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      customerName: customerName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      deliveryZone,
      deliveryFee,
      note: note.trim() || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        variantLabel: i.variant?.label,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal,
      total,
      status: 'অর্ডার কনফার্ম হয়েছে',
      createdAt: new Date().toLocaleString('bn-BD', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    setConfirmedOrder(newOrder);
    onOrderConfirmed(newOrder);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 backdrop-blur-[1px] p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="অর্ডার সম্পন্ন করুন"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">
            {confirmedOrder ? 'অর্ডার কনফার্ম হয়েছে' : 'দ্রুত অর্ডার ফর্ম (ক্যাশ অন ডেলিভারি)'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {confirmedOrder ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">অর্ডার আইডি</p>
                <p className="text-2xl font-bold text-[#2563EB] tabular-nums mt-0.5">
                  #{confirmedOrder.id}
                </p>
                <p className="text-sm text-slate-600 mt-1.5">
                  ধন্যবাদ, <span className="font-semibold">{confirmedOrder.customerName}</span>!
                  আপনার অর্ডারটি গ্রহণ করা হয়েছে।
                </p>
              </div>

              <div className="text-left bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">স্ট্যাটাস</span>
                  <span className="font-semibold text-emerald-700">{confirmedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">মোবাইল</span>
                  <span className="font-medium tabular-nums">{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">ঠিকানা</span>
                  <span className="font-medium text-right">{confirmedOrder.address}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span>
                        {it.name} {it.variantLabel ? `(${it.variantLabel})` : ''} × {it.quantity}
                      </span>
                      <span className="tabular-nums font-semibold">
                        ৳{it.unitPrice * it.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="tabular-nums">৳{confirmedOrder.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>সর্বমোট পরিশোধযোগ্য</span>
                    <span className="text-[#2563EB] tabular-nums">৳{confirmedOrder.total}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                হেডারের ট্রাক আইকনে ক্লিক করে অর্ডার আইডি (#{confirmedOrder.id}) দিয়ে যেকোনো সময় ট্র্যাক করতে পারবেন।
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm cursor-pointer"
              >
                হোমে ফিরে যান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  অর্ডারকৃত পণ্যসমূহ
                </span>
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.variant ? `${item.variant.label} • ` : ''}পরিমাণ: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#2563EB] tabular-nums shrink-0">
                      ৳{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আপনার নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="পূর্ণ নাম লিখুন"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ডেলিভারি এলাকা *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryZone('inside_dhaka')}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        deliveryZone === 'inside_dhaka'
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-semibold">ঢাকার ভেতরে</span>
                      <span className="block text-xs opacity-80 tabular-nums mt-0.5">
                        ডেলিভারি চার্জ ৳60
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryZone('outside_dhaka')}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        deliveryZone === 'outside_dhaka'
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-semibold">ঢাকার বাইরে</span>
                      <span className="block text-xs opacity-80 tabular-nums mt-0.5">
                        ডেলিভারি চার্জ ৳120
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বাসা/হোল্ডিং নম্বর, রোড, থানা ও জেলা লিখুন"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="যেমন: কালার পছন্দ বা ডেলিভারির সময়"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* COD summary */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল</span>
                  <span className="tabular-nums">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="tabular-nums">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>সর্বমোট (ক্যাশ অন ডেলিভারি)</span>
                  <span className="text-[#2563EB] text-base tabular-nums">৳{total}</span>
                </div>
                <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-[#6E8FD4]" />
                    পণ্য হাতে পেয়ে টাকা দিন
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#6E8FD4]" />
                    ৪৮–৭২ ঘণ্টায় ডেলিভারি
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer"
              >
                অর্ডার কনফার্ম করুন — ৳{total}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
