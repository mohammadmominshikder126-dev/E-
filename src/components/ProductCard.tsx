import { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onOrderNow,
  onQuickView,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group rounded-[14px] border border-[#475569] bg-white overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="relative aspect-[1.03/1] w-full bg-slate-100 overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        aria-label={`${product.name} বিস্তারিত দেখুন`}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2 p-4 text-slate-500">
            <Package className="w-8 h-8 text-[#6E8FD4]" />
            <span className="text-xs font-medium text-center">{product.name}</span>
          </div>
        )}
      </button>

      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
        >
          <h3 className="text-[#6E8FD4] font-medium text-[15px] sm:text-[17px] leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
            {product.name}
          </h3>
        </button>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2 min-h-[40px]">
            <div className="flex items-baseline gap-1.5 flex-wrap tabular-nums">
              <span className="text-[#2563EB] font-bold text-lg sm:text-xl leading-none">
                ৳{product.price}
              </span>
              {product.pricePrefix && (
                <span className="text-xs sm:text-sm text-slate-600 font-normal">
                  {product.pricePrefix}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-slate-500 line-through font-normal">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>

            {product.inStock && (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                aria-label={`${product.name} কার্টে যোগ করুন`}
                title="কার্টে যোগ করুন"
                className="w-10 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
              >
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            )}
          </div>

          {product.inStock ? (
            <button
              type="button"
              onClick={() => onOrderNow(product)}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold text-sm sm:text-[15px] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
            >
              অর্ডার করুন
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#414E5E] text-[#94A3B8] font-semibold text-sm sm:text-[15px] cursor-not-allowed whitespace-nowrap"
            >
              স্টক নেই
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
