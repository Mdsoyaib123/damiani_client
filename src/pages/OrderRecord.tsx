
import { Check, Package, Clock3 } from "lucide-react";
import { useGetUserCompletedProductsQuery } from "@/store/api/user/userApi";

interface Product {
  _id: string;
  productId: number;
  status: string;
  name: string;
  price: number;
  commission: number;
  salePrice: number;
  introduction: string;
  poster: string;
  isAdminAssigned: boolean;
  createdAt: string;
  updatedAt: string;
}

const OrderRecordSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f3] pb-10 animate-pulse">
      <div className="max-w-125 mx-auto">
        {/* Header Skeleton */}
        <header className="px-5 pt-8 pb-6 border-b border-gray-200/70">
          <div className="h-3 w-24 bg-gray-200 rounded-sm mb-4" />

          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <div className="h-8 w-48 max-w-full bg-gray-200 rounded-sm" />
              <div className="h-3 w-56 max-w-full bg-gray-200/80 rounded-sm mt-3" />
            </div>

            <div className="text-right shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-sm ml-auto" />
              <div className="h-2 w-12 bg-gray-200 rounded-sm mt-2 ml-auto" />
            </div>
          </div>
        </header>

        <div className="px-5">
          {/* Section Heading Skeleton */}
          <div className="flex items-center justify-between py-5 gap-3">
            <div className="h-3 w-36 bg-gray-200 rounded-sm" />
            <div className="h-3 w-20 bg-gray-200 rounded-sm" />
          </div>

          {/* Order Card Skeletons */}
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className="border border-gray-200/80 bg-white"
              >
                {/* Order Header */}
                <div className="px-4 py-3.5 flex items-center justify-between gap-3 border-b border-gray-100">
                  <div className="min-w-0 flex-1">
                    <div className="h-2 w-32 bg-gray-200 rounded-sm" />
                    <div className="h-3 w-20 bg-gray-200/80 rounded-sm mt-2" />
                  </div>

                  <div className="h-7 w-24 bg-emerald-50 border border-emerald-100/70 rounded-sm shrink-0" />
                </div>

                {/* Product Overview */}
                <div className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-28 shrink-0 bg-gray-100" />

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="h-2 w-20 bg-gray-200 rounded-sm mb-3" />
                      <div className="h-4 w-full bg-gray-200 rounded-sm" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded-sm mt-2" />

                      <div className="mt-3 space-y-2">
                        <div className="h-2.5 w-full bg-gray-100 rounded-sm" />
                        <div className="h-2.5 w-4/5 bg-gray-100 rounded-sm" />
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-3 h-3 bg-gray-200 rounded-full shrink-0" />
                        <div className="h-2.5 w-28 bg-gray-200 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Skeleton */}
                  <div className="mt-5 border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="h-2.5 w-24 bg-gray-200 rounded-sm" />
                      <div className="h-3 w-20 bg-gray-200 rounded-sm" />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="h-2.5 w-20 bg-gray-200 rounded-sm" />
                      <div className="h-3 w-24 bg-emerald-100 rounded-sm" />
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-end justify-between gap-3">
                      <div>
                        <div className="h-2 w-20 bg-gray-200 rounded-sm" />
                        <div className="h-2.5 w-32 bg-gray-100 rounded-sm mt-2" />
                      </div>

                      <div className="h-6 w-24 bg-gray-200 rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* Footer Skeleton */}
                <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="h-2 w-20 bg-gray-200 rounded-sm" />
                  <div className="h-3 w-36 max-w-[60%] bg-gray-200 rounded-sm" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const OrderRecord = () => {
  const userId = localStorage.getItem("userId");

  const { data, isLoading, error } = useGetUserCompletedProductsQuery(
    Number(userId),
    { skip: !userId },
  );

  const products: Product[] = data?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatPrice = (price: number) =>
    `৳${Number(price ?? 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center px-6">
        <div className="text-center">
          <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />

          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
            Login required
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Please login to view your orders.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <OrderRecordSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center px-6">
        <div className="text-center">
          <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />

          <p className="text-[11px] uppercase tracking-[0.18em] text-red-400">
            Unable to load orders
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] pb-10">
      <div className="max-w-125 mx-auto">
        {/* Page Header */}
        <header className="px-5 pt-8 pb-6 border-b border-gray-200/70">
          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-400 mb-3">
            Your account
          </p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-black">
                Order history
              </h1>

              <p className="text-xs text-gray-400 mt-2">
                A record of your completed purchases.
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-2xl font-light text-black tabular-nums">
                {String(products.length).padStart(2, "0")}
              </p>

              <p className="text-[9px] text-gray-400 uppercase tracking-[0.16em] mt-1">
                Orders
              </p>
            </div>
          </div>
        </header>

        {products.length === 0 ? (
          <div className="px-6 py-24 text-center">
            <div className="w-14 h-14 border border-gray-200 flex items-center justify-center mx-auto mb-5 bg-white">
              <Package className="w-5 h-5 text-gray-300" />
            </div>

            <h2 className="text-lg font-light text-black">
              No orders yet
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Your completed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="px-5">
            {/* Section Heading */}
            <div className="flex items-center justify-between py-5 gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Completed purchases
              </p>

              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                All records
              </span>
            </div>

            {/* Order List */}
            <div className="space-y-5">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="border border-gray-200/80 bg-white"
                >
                  {/* Order Header */}
                  <div className="px-4 py-3.5 flex items-center justify-between gap-3 border-b border-gray-100">
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase tracking-[0.18em]">
                        Juwelo · Order record
                      </p>

                      <p className="text-xs text-black mt-1">
                        Ref. {product.productId}
                      </p>
                    </div>

                    <span className="shrink-0 flex items-center gap-1.5 border border-emerald-100 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-emerald-700">
                      <Check className="w-3 h-3" />
                      Completed
                    </span>
                  </div>

                  {/* Product Overview */}
                  <div className="p-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-28 shrink-0 bg-[#f5f5f3] overflow-hidden">
                        <img
                          src={product.poster}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='240'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f3'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-2">
                          Product {product.productId}
                        </p>

                        <h2 className="text-base font-light leading-snug text-black">
                          {product.name}
                        </h2>

                        <p className="text-[11px] text-gray-400 leading-relaxed mt-2 line-clamp-3">
                          {product.introduction ||
                            "No description available."}
                        </p>

                        <div className="flex items-center gap-1.5 mt-3 text-gray-400">
                          <Clock3 className="w-3 h-3 shrink-0" />

                          <span className="text-[10px] leading-relaxed">
                            {formatDate(product.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.14em]">
                          Product price
                        </span>

                        <span className="text-xs text-gray-600 tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.14em]">
                          Commission
                        </span>

                        <span className="text-xs text-emerald-600 tabular-nums">
                          +{formatPrice(product.commission)}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-[0.18em]">
                            Total price
                          </p>

                          <p className="text-[10px] text-gray-400 mt-1">
                            Final recorded amount
                          </p>
                        </div>

                        <p className="text-xl font-light tracking-tight text-black tabular-nums">
                          {formatPrice(product.salePrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Completion Footer */}
                  <div className="px-4 py-3 bg-[#fafaf8] border-t border-gray-100 flex items-center justify-between gap-3">
                    <span className="text-[9px] text-gray-400 uppercase tracking-[0.15em]">
                      Order status
                    </span>

                    <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Successfully completed
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderRecord;
