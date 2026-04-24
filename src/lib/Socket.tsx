import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Initialiser la connexion Socket.IO
export const initSocket = (userId: string) => {
  // Créer la connexion
  socket = io("http://localhost:3001", {
    transports: ["websocket"], // Utiliser WebSocket (plus rapide)
  });

  // S'authentifier auprès du serveur
  socket.emit("authenticate", userId);

  // Événements de connexion
  socket.on("connect", () => {
    console.log("✅ Socket.IO connecté");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket.IO déconnecté");
  });

  return socket;
};

// Récupérer la socket (pour écouter les événements)
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket non initialisé. Appelez initSocket() d'abord.");
  }
  return socket;
};

// Fermer la connexion
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
