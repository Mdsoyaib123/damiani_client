import { baseApi } from "../baseApi";

interface RegisterPayload {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    invitationCode?: string;
}

interface LoginPayload {
    phoneNumber: string;
    password: string;
}

interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<any, RegisterPayload>({
            query: (data) => ({
                url: "/user/create",
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation<any, LoginPayload>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation<
            { data: { accessToken: string } },
            { email: string; password: string }
        >({
            query: (data) => ({
                url: "/auth/refresh-token",
                method: "POST",
                body: data,
            }),
        }),
        changePassword: builder.mutation<any, ChangePasswordPayload>({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useChangePasswordMutation } = authApi;
