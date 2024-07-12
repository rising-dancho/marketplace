import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_BASE_URL;
export const socket = io(URL, {
  transports: ["websocket", "polling"],
});
