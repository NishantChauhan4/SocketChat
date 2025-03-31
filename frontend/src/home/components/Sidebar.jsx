import React, { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import useConversations from "../../Zustand/useConversations";
import { useSocketContext } from "../../context/SocketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = useConversations();
  const { onlineUser, socket } = useSocketContext();
  const [newMessageUsers, setNewMessageUsers] = useState("");

  // chats function

  // const nowOnline = chatUsers.map((user) => user._id);
  // const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  const isUserOnline = (userId) => {
    if (!onlineUser || !userId) return false;
    return onlineUser.includes(userId.toString());
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);

      return () => socket?.off("newMessage");
    });
  }, [socket, messages]);

  useEffect(() => {
    console.log("Online Users:", onlineUser);
  }, [onlineUser]);

  // Show user with you chatted with
  useEffect(() => {
    const chatUsersHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }

        setLoading(false);
        setChatUsers(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUsersHandler();
  }, []);

  // Show user from the search result
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    // if (!searchInput.trim()) {
    //   return;
    // }

    setLoading(true);

    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      setLoading(false);
      if (data.length === 0) {
        toast.info("User not found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Show which user is selected
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  // When pressing the back button after searching for a user
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
    setSelectedUserId(null);
  };

  // When pressing logout
  const handleLogout = async () => {
    const confirmLogout = window.prompt("Type 'Username' to logout");

    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("socketchat");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Logout cancelled");
    }
  };

  return (
    <div
      className="w-auto h-full px-1"
      style={{
        backgroundColor: "rgba(156, 163, 175, 0.3)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full mt-4 h-10"
        >
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            type="text"
            placeholder="Search User"
          />
          <button
            className="btn btn-circle bg-sky-700 hover:bg-gray-950"
            type="submit"
          >
            <FaSearch />
          </button>
        </form>
        <img
          // onClick={() => {
          //   navigate(`/profile/${authUser?._id}`);
          // }}
          src={authUser?.profilepic}
          className="w-12 h-12 self-center hover:scale-110 cursor-pointer mt-3.5"
        />
      </div>
      <div className="divider px-3"></div>

      {searchUser.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer hover:cursor-pointer
                             ${
                               selectedUserId === user?._id ? `bg-sky-500` : ``
                             }`}
                  >
                    <div
                      className={`avatar ${
                        isUserOnline(user._id) ? "online" : ""
                      }`}
                    >
                      <div className="w-12 rounded-full h-12">
                        <img src={user.profilepic} alt="user avatar" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-gray-950 cursor-pointer hover:cursor-pointer">
                        {user.username}
                      </p>
                    </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={() => {
                handleSearchBack();
              }}
              className="bg-white rounded-full px-2 py-1 self-center cursor-pointer"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUsers.length === 0 ? (
                <>
                  <h1 className="text-yellow-500 font-semibold text-center text-2xl">
                    Search users to chat
                  </h1>
                </>
              ) : (
                <>
                  {chatUsers.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                             ${
                               selectedUserId === user?._id ? `bg-sky-500` : ``
                             }`}
                      >
                        <div
                          className={`avatar ${
                            isUserOnline(user._id) ? "online" : ""
                          }`}
                        >
                          <div className="w-12 rounded-full h-12">
                            <img src={user.profilepic} alt="user avatar" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-gray-950">
                            {user.username}
                          </p>
                        </div>

                        {newMessageUsers.receiverId === authUser._id &&
                        newMessageUsers.senderId === user._id ? (
                          <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                            +1
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="divider divide-solid px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={() => {
                handleLogout();
              }}
              className="hover:bg-red-600 w-10 cursor-pointer hover:text-white rounded-lg"
            >
              <BiLogOut size={25} />
            </button>
            <p className="py-1">Logout</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
