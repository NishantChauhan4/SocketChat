import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) return;

    const newSocket = io("http://localhost:5000", {
      query: {
        userId: authUser._id,
      },
    });

    // Log connection status
    newSocket.on("connect", () => {
      console.log("Socket Connected");
    });

    newSocket.on("getOnlineUsers", (users) => {
      console.log("Online Users Received:", users);
      setOnlineUser(users);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
