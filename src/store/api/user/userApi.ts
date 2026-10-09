import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get single user data
        getSingleUser: builder.query({
            query: (userId: number) => ({
                url: `/user/getSingle/${userId}`,
                method: "GET",
            }),
            providesTags: (userId) => [
                { type: "Auth", id: userId },
            ],
            keepUnusedDataFor: 0, // Don't cache for long periods
            // Refetch whenever the component mounts or arguments change
            // refetchOnMountOrArgChange: true,
            // // Optionally refetch when window regains focus (useful for admin updates)
            // refetchOnFocus: true,
            // // Refetch when network reconnects
            // refetchOnReconnect: true
        }),

        // Update selected package amount
        updateSelectedPackage: builder.mutation({
            query: ({ userId, amount }: { userId: number; amount: number }) => ({
                url: `/user/update-selected-package-amount/${userId}`,
                method: "PATCH",
                body: { amount },
            }),
            invalidatesTags: ["Auth"],

        }),

        // Get purchase order (product to purchase)
        getPurchaseOrder: builder.query({
            query: (userId: number) => ({
                url: `/user/purchase-order/${userId}`,
                method: "GET",
            }),
            providesTags: ["PurchaseOrder"],
            keepUnusedDataFor: 0,
            // refetchOnMountOrArgChange: true
        }),

        // Confirm purchase order
        confirmPurchaseOrder: builder.mutation({
            query: ({ userId, productId }: { userId: number; productId: number }) => ({
                url: `/user/confirmed-purchase-order/${userId}/${productId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Auth"],
        }),

        // Remove mystery reward (reset to 0)
        removeMysteryReward: builder.mutation({
            query: (userId: number) => ({
                url: `/user/remove-mystery-reward/${userId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Auth"],
        }),

        claimCheckInReward: builder.mutation<
            any, // response type (you can type it if you have one)
            { userId: number; checkInAmount: number }
        >({
            query: ({ userId, checkInAmount }) => ({
                url: `/user/add-check-in-reward/${userId}`,
                method: "PATCH",
                body: { checkInAmount },
            }),
            invalidatesTags: ["Auth"], // so user data refetches
        }),

        getUserCompletedProducts: builder.query({
            query: (userId: number) => ({
                url: `/user/get-user-completed-products/${userId}`,
                method: "GET",
            }),
            providesTags: ["Auth"],
        }),

        // Mark mystery box as seen
        markMysteryBoxAsSeen: builder.mutation<
            any,
            { userId: number; productId: number }
        >({
            query: ({ userId, productId }) => ({
                url: `/user/mark-mystery-box-seen/${userId}/${productId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Auth"],
        }),

        // Update withdraw password
        updateWithdrawPassword: builder.mutation({
            query: ({ userId, withdrawPassword }: { userId: number; withdrawPassword: string }) => ({
                url: `/user/update-withdraw-password/${userId}`,
                method: "PATCH",
                body: { withdrawPassword },
            }),
            invalidatesTags: ["Auth"],
        }),
    }),
});

export const {
    useGetSingleUserQuery,
    useUpdateSelectedPackageMutation,
    useGetPurchaseOrderQuery,
    useConfirmPurchaseOrderMutation,
    useRemoveMysteryRewardMutation,
    useClaimCheckInRewardMutation,
    useGetUserCompletedProductsQuery,
    useMarkMysteryBoxAsSeenMutation,
    useUpdateWithdrawPasswordMutation,
} = userApi;