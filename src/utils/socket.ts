import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Extract base URL (origin only) for Socket.IO - it doesn't need the /api/v1 path
const getSocketUrl = () => {
    // Use separate socket URL if defined, otherwise extract origin from API URL
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
        const url = new URL(apiUrl);
        return url.origin; // Returns just "https://api.juweloonline.com"
    } catch {
        return apiUrl; // Fallback if URL parsing fails
    }
};

export const connectSocket = (token: string) => {
    if (socket?.connected) return; // Already connected

    const socketUrl = getSocketUrl();
    console.log("Connecting to socket at:", socketUrl);

    socket = io(socketUrl, {
        auth: { token },
        transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {
        console.log("🟢 Socket connected");
    });
    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
    });
    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });
};
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("🔴 Socket manually disconnected");
    }
};
export const getSocket = () => socket;