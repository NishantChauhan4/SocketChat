import React, { useEffect, useState } from "react";
import useConversations from "../../Zustand/useConversations";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useRef } from "react";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/Sound/notification.mp3";

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = useConversations();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages, newMessage]);

      return () => socket?.off("newMessage");
    });
  }, [socket, setMessages, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `./api/message/${selectedConversation?._id}`
        );
        const data = get.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }

        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) {
      return;
    }

    setSending(true);

    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );

      const data = res.data;

      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }

      setSending(false);
      setMessages([...messages, data]);
      setSendData("");
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    setSendData(e.target.value);
  };

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">
              Welcome!{" "}
              <span className="text-green-400">{authUser.username}</span>
            </p>
            <p className="text-2xl">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center text-green-400" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-500 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={() => {
                    onBackUser(true);
                  }}
                  className="bg-white rounded-full px-2 py-1 self-center"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>

              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation.profilepic}
                    alt=""
                  />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto"
            style={{
              backgroundColor: "rgba(229, 231, 235, 1)",
            }}
          >
            {loading && (
              <div className="flex w-full h-full flex-col justify-center items-center gap-4 bg-transaprent">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && messages.length === 0 && (
              <p className="text-center text-green-600 items-center">
                Send a message to start conversation
              </p>
            )}
            {!loading &&
              messages.length > 0 &&
              messages?.map((message) => (
                <div key={message?._id} ref={lastMessageRef}>
                  <div
                    className={`chat ${
                      message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar"></div>

                    <div
                      className={`chat-bubble ${
                        message.senderId === authUser._id
                          ? "bg-sky-600"
                          : "chat-start bg-gray-400"
                      }`}
                    >
                      {message?.message}
                    </div>

                    <div className="chat-footer text-[10px] opacity-80">
                      {new Date(message?.createdAt).toLocaleDateString("en-IN")}
                      <span className="mx-1">•</span>
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <form className="rounded-full text-black" onSubmit={handleSubmit}>
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                onChange={handleMessage}
                value={sendData}
                required
                id="message"
                type="text"
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={25}
                    className="text-sky-700 cursor-pointed rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
