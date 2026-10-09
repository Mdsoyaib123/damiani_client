
// src/redux/api/withdrawApi.ts

import { baseApi } from "../baseApi";

interface BindAccountPayload {
    userId: number;
    name: string;
    withdrawMethod: "BankTransfer" | "MobileBanking";
    bankName?: string;
    bankAccountNumber?: number;
    branchName?: string;
    district?: string;
    mobileBankingName?: string;
    mobileBankingAccountNumber?: number;
}


interface BindAccountResponse {
    success: boolean;
    message: string;
    data: any;
}

interface CreateWithdrawPayload {
    userId: number;
    amount: number;
    withdrawPassword: string;
}

interface CreateWithdrawResponse {
    success: boolean;
    message: string;
    data?: any;
}

interface HistoryItem {
    _id: string;
    userId: string;
    historyType: "checkIn" | "withdraw" | "recharge";
    amount: number;
    time: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SingleHistoryItem {
    _id: string;
    userId: number;
    amount: number;
    transactionStatus: string;
    superiorUserName: string;
    name: string;
    withdrawMethod: string;
    bankName?: string;
    bankAccountNumber?: number;
    branchName?: string;
    district?: string;
    withdrawalAmount: number;
    totalRechargeAmount: number;
    totalWithdrawalAmount: number;
    applicationTime: string;
    processingTime?: string;
    reviewRemark?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SingleHistoryResponse {
    success: boolean;
    data: SingleHistoryItem[]; // It returns an array
}

interface HistoryResponse {
    success: boolean;
    data: HistoryItem[];
}

export const withdrawApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        bindAccount: builder.mutation<BindAccountResponse, BindAccountPayload>({
            query: (payload) => {
                const { userId, ...body } = payload;
                console.log("API Body being sent:", body); // Debug log
                return {
                    url: `/user/update-withdrawal-address/${userId}`,
                    method: "PATCH",
                    body,
                };
            },
            invalidatesTags: ["Auth"],
        }),

        createWithdraw: builder.mutation<CreateWithdrawResponse, CreateWithdrawPayload>({
            query: (payload) => ({
                url: "/withdraw/create-withdraw",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Withdraw"],
        }),
        getHistory: builder.query<HistoryResponse, { userId: string; historyType: "checkIn" | "withdraw" | "recharge" }>({
            query: ({ userId, historyType }) => ({
                url: `/history/getAll/${userId}?historyType=${historyType}`,
                method: "GET",
            }),
            providesTags: ["History"],
        }),
        getSingleWithdrawHistory: builder.query<SingleHistoryResponse, { userId: number }>({
            query: ({ userId }) => ({
                url: `/withdraw/getSingleUserWithdraws/${userId}`,
                method: "GET",
            }),
            providesTags: ["History"],
        }),
    }),
});

export const {
    useBindAccountMutation,
    useCreateWithdrawMutation,
    useGetHistoryQuery,
    useGetSingleWithdrawHistoryQuery
} = withdrawApi;