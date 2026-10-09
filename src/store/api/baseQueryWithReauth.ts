import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setCredentials } from "../Slices/AuthSlice/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    unknown
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // ✅ If access token expired
    if (
        result.error &&
        ((result.error as any).status === 401 ||
            (result.error as any).status === 403)
    ) {

        const state = api.getState() as RootState;

        if (!state.auth.refreshToken) {
            api.dispatch(logout());
            return result;
        }

        // 🔄 Call refresh-token API
        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh-token",
                method: "POST",
                body: {
                    email: state.auth.user?.email,
                    password: state.auth.refreshToken, // backend design dependent
                },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as any).data.accessToken;

            api.dispatch(
                setCredentials({
                    user: state.auth.user!,
                    token: newAccessToken,
                    refreshToken: state.auth.refreshToken!,
                })
            );

            // 🔁 Retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};
