import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./components/Sidebar";
import MessageContainer from "./components/MessageContainer";

function Home() {
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div
      className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl shadow-lg"
      style={{
        backgroundColor: "rgba(156, 163, 175, 0.3)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className={`w-full py-2 md:flex ${isSidebarVisible ? "" : "hidden"}`}
      >
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      <div
        className={`divider divider-horizontal px-3 md:flex ${
          isSidebarVisible ? "" : "hidden"
        } ${selectedUser ? "block" : "hidden"}`}
      ></div>

      <div
        className={`flex-auto bg-gray-200 ${
          selectedUser ? "" : "hidden md:flex"
        }`}
      >
        <MessageContainer onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
}

export default Home;
