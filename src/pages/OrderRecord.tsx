import { Loader2 } from "lucide-react";
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

const OrderRecord = () => {
    const userId = localStorage.getItem("userId");

    const { data, isLoading, error } = useGetUserCompletedProductsQuery(
        Number(userId),
        {
            skip: !userId,
        }
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const formatPrice = (price: number) => {
        return price.toFixed(2);
    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Please login to view your orders</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Failed to load orders</p>
                </div>
            </div>
        );
    }

    const products = data?.data || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <div className="max-w-md mx-auto">
                {products.length === 0 ? (
                    <div className="flex items-center justify-center pt-20">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4 px-4 pt-4">
                        {products.map((product: Product, index: number) => (
                            <div
                                key={`${product._id}-${index}`}
                                className="bg-white rounded-lg shadow-sm overflow-hidden relative"
                            >
                                {/* Corner Badge */}
                                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 transform rotate-45 translate-x-6 -translate-y-6"></div>
                                    <div className="absolute top-1 right-1 text-white text-xs font-bold z-10">
                                        ✓
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Header */}
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Juwelo Order</p>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Product Image */}
                                    <div className="mb-4">
                                        <img
                                            src={product.poster}
                                            alt={product.name}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Product Code:</span>
                                            <span className="text-gray-700 font-medium">
                                                {product.productId}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Order time:</span>
                                            <span className="text-gray-700">
                                                {formatDate(product.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Description:</span>
                                            <span className="text-gray-700 text-right max-w-[200px] truncate">
                                                {product.introduction}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Price:</span>
                                            <span className="text-gray-700">
                                                ৳{formatPrice(product.price)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total Price:</span>
                                            <span className="text-gray-900 font-semibold">
                                                ৳{formatPrice(product.salePrice)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Profit Rate:</span>
                                            <span className="text-gray-900 font-semibold">
                                                ৳{formatPrice(product.commission)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continue Button */}
                                    <button className="w-full mt-4 bg-black text-white py-3 rounded-md font-medium  transition-colors">
                                        Completed
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderRecord;