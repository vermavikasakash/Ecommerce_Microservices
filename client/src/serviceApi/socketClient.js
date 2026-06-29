import { io } from "socket.io-client";
import { API_BASE_URL, getCustomerId } from "./servicesApi";

let socket;

const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      query: {
        customerId: getCustomerId(),
      },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

const reconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  return getSocket();
};

export { getSocket, reconnectSocket };
