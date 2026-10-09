import { disconnectSocket } from "@/utils/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: number;
  role: string;
  email?: string;
  _id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("userId", String(action.payload.user.userId))
      localStorage.setItem("role", String(action.payload.user.role))
      localStorage.setItem("mongodbId", String(action.payload.user._id))
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      disconnectSocket();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
