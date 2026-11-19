import { useState } from 'react';
import { X, ShoppingCart, Check, Minus, Plus, Truck, Banknote } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onOrderNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
  onOrderNow,
}: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const activePrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <span className="text-xs font-semibold text-[#6E8FD4] tracking-wide">
            E-shop • পণ্যের বিস্তারিত
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div className="aspect-[1.03/1] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2
                id="modal-product-title"
                className="text-xl font-bold text-[#6E8FD4] leading-snug"
              >
                {product.name}
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {product.shortDesc}
              </p>
            </div>

            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-2xl font-bold text-[#2563EB]">৳{activePrice}</span>
              {product.originalPrice && !selectedVariant && (
                <span className="text-sm text-slate-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              <span
                className={`ml-auto text-xs font-semibold ${
                  product.inStock ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {product.inStock ? 'স্টকে আছে' : 'স্টক নেই'}
              </span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  ভ্যারিয়েন্ট নির্বাচন করুন:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {variant.label} — ৳{variant.price}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              {product.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {product.inStock && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-slate-700">পরিমাণ:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="পরিমাণ কমান"
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="পরিমাণ বাড়ান"
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#6E8FD4]" />
                সারা দেশে ডেলিভারি
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-[#6E8FD4]" />
                ক্যাশ অন ডেলিভারি
              </span>
            </div>

            {product.inStock ? (
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedVariant, quantity);
                    onClose();
                  }}
                  className="px-4 py-3 rounded-xl border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>কার্টে রাখুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOrderNow(product, selectedVariant, quantity);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  অর্ডার করুন — ৳{activePrice * quantity}
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 rounded-xl bg-[#414E5E] text-[#94A3B8] font-semibold text-sm cursor-not-allowed"
              >
                স্টক নেই
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
