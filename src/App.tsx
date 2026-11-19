import { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  ShoppingCart,
  Banknote,
  CheckCircle2,
  Headphones,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { PRODUCTS } from './data/products';
import {
  Product,
  ProductVariant,
  CartItem,
  OrderRecord,
  CatalogFilter,
} from './types';
import { ProductCard } from './components/ProductCard';
import { OfferGraphic } from './components/OfferGraphic';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SupportWidget } from './components/SupportWidget';

const ORDERS_STORAGE_KEY = 'prime_gadget_orders_v1';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [checkoutIsFromCart, setCheckoutIsFromCart] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const bestSellers = useMemo(
    () => PRODUCTS.filter((p) => p.isBestSeller),
    []
  );
  const offerProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isOnOffer),
    []
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredCatalog = useMemo(() => {
    switch (catalogFilter) {
      case 'offer':
        return PRODUCTS.filter((p) => p.isOnOffer);
      case 'bestseller':
        return PRODUCTS.filter((p) => p.isBestSeller);
      case 'instock':
        return PRODUCTS.filter((p) => p.inStock);
      default:
        return PRODUCTS;
    }
  }, [catalogFilter]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    if (!product.inStock) return;
    const activeVariant = variant || product.variants?.[0];
    const unitPrice = activeVariant ? activeVariant.price : product.price;
    const key = `${product.id}:${activeVariant?.id || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          variant: activeVariant,
          unitPrice,
          quantity,
        },
      ];
    });

    setToastMessage(`"${product.name}" কার্টে যোগ করা হয়েছে`);
  };

  const handleUpdateCartQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleOrderNow = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    if (!product.inStock) return;
    const activeVariant = variant || product.variants?.[0];
    const unitPrice = activeVariant ? activeVariant.price : product.price;
    const key = `${product.id}:${activeVariant?.id || 'default'}`;
    setCheckoutIsFromCart(false);
    setCheckoutItems([
      {
        key,
        product,
        variant: activeVariant,
        unitPrice,
        quantity,
      },
    ]);
  };

  const handleCheckoutFromCart = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setCheckoutIsFromCart(true);
    setCheckoutItems(cart);
  };

  const handleOrderConfirmed = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    if (checkoutIsFromCart) {
      setCart([]);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openCatalogWithFilter = (filter: CatalogFilter) => {
    setCatalogFilter(filter);
    scrollToSection('all-products');
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="inline-flex items-center gap-2 text-left text-[#708FD4] hover:text-[#2563EB] font-bold text-base sm:text-xl leading-none tracking-tight whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <img
              src="/assets/aistudio/IMG_20261119_060543_781_dd82193f.jpg"
              alt="E-shop লোগো"
              referrerPolicy="no-referrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 shadow-sm"
            />
            <span>E-shop</span>
          </button>

          {/* Search Pill */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খুঁজুন..."
              aria-label="পণ্য খুঁজুন"
              className="w-full h-10 sm:h-11 px-4 pr-9 rounded-full border border-slate-600 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="অনুসন্ধান মুছুন"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsTrackingOpen(true)}
              aria-label="অর্ডার ট্র্যাক করুন"
              title="অর্ডার ট্র্যাক করুন"
              className="relative p-2 rounded-xl text-[#708FD4] hover:text-[#2563EB] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Truck className="w-6 h-6" strokeWidth={1.75} />
              {orders.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="শপিং কার্ট দেখুন"
              title="শপিং কার্ট"
              className="relative p-2 rounded-xl text-slate-500 hover:text-[#2563EB] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-[#2563EB] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 pb-20">
        {/* Live Search Results (only shown when typing) */}
        {searchQuery.trim() !== '' && (
          <section className="pt-6 pb-8 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-[#708FD4] font-bold text-xl sm:text-2xl">
                  খোঁজার ফলাফল
                </h2>
                <p className="text-slate-600 text-sm">
                  &ldquo;{searchQuery}&rdquo; — {searchResults.length}টি পণ্য পাওয়া গেছে
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-sm font-medium text-[#2563EB] hover:underline cursor-pointer"
              >
                সব দেখুন
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOrderNow={handleOrderNow}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 px-4 text-center rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-slate-700 font-semibold">কোনো পণ্য পাওয়া যায়নি</p>
                <p className="text-sm text-slate-500 mt-1">
                  অন্য নাম লিখে খুঁজুন অথবা নিচের সব পণ্য দেখুন।
                </p>
              </div>
            )}
          </section>
        )}

        {/* Section 1: Trust & Service Highlights */}
        <section
          aria-label="সেবাসমূহ"
          className="py-6 sm:py-8 border-b border-slate-100"
        >
          <div className="max-w-[270px] mx-auto flex flex-col gap-5 md:max-w-none md:grid md:grid-cols-4 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#F4F7FC] flex items-center justify-center text-[#2563EB] shrink-0">
                <Truck className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[#708FD4] font-semibold text-base leading-snug">
                  সারা দেশে ডেলিভারি
                </h3>
                <p className="text-slate-600 text-sm">দ্রুত ও নিরাপদে</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#F4F7FC] flex items-center justify-center text-[#2563EB] shrink-0">
                <Banknote className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[#708FD4] font-semibold text-base leading-snug">
                  ক্যাশ অন ডেলিভারি
                </h3>
                <p className="text-slate-600 text-sm">পণ্য হাতে পেয়ে টাকা</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openCatalogWithFilter('all')}
              className="flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F4F7FC] group-hover:bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0 transition-colors">
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[#708FD4] group-hover:text-[#2563EB] font-semibold text-base leading-snug transition-colors">
                  ALL PRODUCTS
                </h3>
                <p className="text-slate-600 text-sm">কয়েক ক্লিকেই অর্ডার</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F4F7FC] group-hover:bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0 transition-colors">
                <Headphones className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[#708FD4] group-hover:text-[#2563EB] font-semibold text-base leading-snug transition-colors">
                  সাহায্য দরকার?
                </h3>
                <p className="text-slate-600 text-sm">ফোন বা WhatsApp করুন</p>
              </div>
            </button>
          </div>
        </section>

        {/* Section 2: Best Sellers (বেশি বিক্রি হচ্ছে) */}
        <section className="pt-7 sm:pt-10 pb-6" aria-labelledby="bestsellers-heading">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2
                id="bestsellers-heading"
                className="text-[#708FD4] font-bold text-2xl sm:text-[26px] leading-tight"
              >
                বেশি বিক্রি হচ্ছে
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-0.5">
                সবাই যা কিনছেন
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCatalogWithFilter('bestseller')}
              className="text-[#2563EB] hover:text-[#1D4ED8] font-medium text-sm sm:text-base inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>সব দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>

        {/* Section 3: Promotional Offer Banner (সীমিত সময়ের অফার) */}
        <section className="my-6 sm:my-10" aria-label="সীমিত সময়ের অফার">
          <div className="bg-[#F8FAFC] rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_2px_16px_rgba(15,23,42,0.04)] grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-10 items-center">
              <div className="md:col-span-7 flex flex-col items-start gap-5">
                <span className="inline-block bg-[#2563EB] text-white font-semibold text-base sm:text-lg px-6 py-3 rounded-xl">
                  সীমিত সময়ের অফার
                </span>

                <h2 className="text-[#708FD4] font-semibold text-[22px] sm:text-3xl leading-[1.35] max-w-lg">
                  বাছাই করা পণ্যে দাম কমেছে, স্টক থাকতে থাকতে নিয়ে নিন
                </h2>

                <button
                  type="button"
                  onClick={() => scrollToSection('offers')}
                  className="inline-flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>অফারগুলো দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-5">
                <OfferGraphic />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: On Offer (অফারে আছে) */}
        <section
          id="offers"
          className="pt-4 sm:pt-6 pb-8 scroll-mt-20"
          aria-labelledby="offers-heading"
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2
                id="offers-heading"
                className="text-[#708FD4] font-bold text-2xl sm:text-[26px] leading-tight"
              >
                অফারে আছে
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-0.5">
                দাম কমেছে যেসব পণ্যে
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCatalogWithFilter('offer')}
              className="text-[#2563EB] hover:text-[#1D4ED8] font-medium text-sm sm:text-base inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>সব দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {offerProducts.map((product) => (
              <ProductCard
                key={`offer-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>

        {/* Section 5: Complete Filterable All Products Catalog */}
        <section
          id="all-products"
          className="pt-8 sm:pt-10 border-t border-slate-200 scroll-mt-20"
          aria-labelledby="catalog-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <h2
                id="catalog-heading"
                className="text-[#708FD4] font-bold text-2xl sm:text-[26px] leading-tight"
              >
                সকল পণ্য
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-0.5">
                পছন্দের গ্যাজেট বেছে অর্ডার করুন
              </p>
            </div>

            <div
              role="tablist"
              aria-label="পণ্য ফিল্টার"
              className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto"
            >
              {[
                { key: 'all', label: 'সব পণ্য' },
                { key: 'bestseller', label: 'বেশি বিক্রি' },
                { key: 'offer', label: 'অফার' },
                { key: 'instock', label: 'স্টকে আছে' },
              ].map((tab) => {
                const active = catalogFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCatalogFilter(tab.key as CatalogFilter)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-white text-[#2563EB] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredCatalog.map((product) => (
              <ProductCard
                key={`catalog-${product.id}`}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Clean Storefront Footer */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[#708FD4] font-bold text-lg">
              <img
                src="/assets/aistudio/IMG_20261119_060543_781_dd82193f.jpg"
                alt="E-shop লোগো"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
              />
              <span>E-shop</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি • পণ্য হাতে পেয়ে মূল্য পরিশোধ
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs sm:text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-[#2563EB] font-medium cursor-pointer"
            >
              অর্ডার ট্র্যাকিং
            </button>
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-[#2563EB] font-medium cursor-pointer"
            >
              যোগাযোগ
            </button>
            <span className="text-slate-400">© ২০২৬ E-shop</span>
          </div>
        </div>
      </footer>

      {/* Floating Green Support / Chat Button */}
      <SupportWidget
        externalOpen={isSupportOpen}
        onCloseExternal={() => setIsSupportOpen(false)}
      />

      {/* Toast Notification when adding to cart */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-40 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm shadow-lg"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-blue-300 hover:text-blue-200 font-semibold whitespace-nowrap cursor-pointer"
          >
            কার্ট দেখুন
          </button>
        </div>
      )}

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutFromCart}
      />

      {/* Cash on Delivery Checkout Modal */}
      {checkoutItems && (
        <CheckoutModal
          items={checkoutItems}
          onClose={() => setCheckoutItems(null)}
          onOrderConfirmed={handleOrderConfirmed}
        />
      )}

      {/* Order Tracking Modal */}
      {isTrackingOpen && (
        <OrderTrackingModal
          orders={orders}
          onClose={() => setIsTrackingOpen(false)}
        />
      )}
    </div>
  );
}
