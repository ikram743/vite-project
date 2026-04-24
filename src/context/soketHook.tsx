// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { getSocket } from "../lib/Socket";
import toast from "react-hot-toast";

export const useSocket = (eventName: string, callback: (data: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      const socket = getSocket();

      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
      socket.on(eventName, callback);

      // Show notification for new events
      if (eventName === "new_donation") {
        toast.success("New surplus available!");
      }

      return () => {
        socket.off(eventName, callback);
      };
    } catch (error) {
      console.error("Socket not initialized");
    }
  }, [eventName, callback]);

  return isConnected;
};
