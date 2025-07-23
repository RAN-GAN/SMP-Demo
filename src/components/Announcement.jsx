import React, { useEffect, useState, useCallback } from "react";
import { faker } from "@faker-js/faker";

function Announcements() {
  // State management - simplified for demo
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [subscribedChats, setSubscribedChats] = useState(new Set());
  const [showChatSelection, setShowChatSelection] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate mock chat groups using faker.js
  const generateMockChats = () => {
    const mockChats = [];
    for (let i = 0; i < 8; i++) {
      mockChats.push({
        id: faker.string.uuid(),
        name: `${faker.company.name()} ${faker.helpers.arrayElement([
          "Team",
          "Group",
          "Class",
          "Department",
        ])}`,
        participantCount: faker.number.int({ min: 5, max: 50 }),
        unreadCount: faker.number.int({ min: 0, max: 5 }),
      });
    }
    return mockChats;
  };

  // Generate mock announcement messages using faker.js
  const generateMockAnnouncements = (chatIds) => {
    const announcements = [];
    const messageCount = faker.number.int({ min: 3, max: 12 });

    for (let i = 0; i < messageCount; i++) {
      const chatId = faker.helpers.arrayElement(chatIds);
      const chat = chats.find((c) => c.id === chatId);

      announcements.push({
        id: faker.string.uuid(),
        chatId: chatId,
        chatName: chat?.name || "Unknown Group",
        from: faker.person.fullName(),
        body: faker.helpers.arrayElement([
          `📢 ${faker.lorem.sentence()}`,
          `🎓 ${faker.lorem.sentences(2)}`,
          `⚠️ Important: ${faker.lorem.sentence()}`,
          `📅 Reminder: ${faker.lorem.sentence()}`,
          `🔔 Update: ${faker.lorem.sentences(1)}`,
          `📋 Notice: ${faker.lorem.sentence()}`,
          `🎯 Announcement: ${faker.lorem.sentences(2)}`,
        ]),
        timestamp: faker.date.recent({ days: 3 }).toISOString(),
      });
    }

    return announcements.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  // Initialize demo data
  useEffect(() => {
    const initializeDemoData = async () => {
      setLoading(true);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockChats = generateMockChats();
      setChats(mockChats);

      // Auto-subscribe to first 2-3 chats for demo
      const initialSubscriptions = mockChats
        .slice(0, faker.number.int({ min: 2, max: 3 }))
        .map((chat) => chat.id);
      setSubscribedChats(new Set(initialSubscriptions));

      // Generate initial announcements
      if (initialSubscriptions.length > 0) {
        const mockAnnouncements =
          generateMockAnnouncements(initialSubscriptions);
        setMessages(mockAnnouncements);
      }

      setLoading(false);
    };

    initializeDemoData();
  }, []);

  // Handle chat subscription toggle
  const handleChatToggle = useCallback(
    (chat) => {
      const isSubscribed = subscribedChats.has(chat.id);

      setSubscribedChats((prev) => {
        const newSet = new Set(prev);
        if (isSubscribed) {
          newSet.delete(chat.id);
          // Remove messages from this chat
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.chatId !== chat.id)
          );
        } else {
          newSet.add(chat.id);
          // Add some new messages from this chat
          const newMessages = generateMockAnnouncements([chat.id]);
          setMessages((prevMessages) => {
            const combined = [...prevMessages, ...newMessages];
            return combined.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
          });
        }
        return newSet;
      });
    },
    [subscribedChats, chats]
  );

  // Handle viewing announcements
  const handleViewAnnouncements = useCallback(() => {
    if (subscribedChats.size === 0) {
      alert("Please subscribe to at least one chat to view announcements.");
      return;
    }
    setShowChatSelection(false);
  }, [subscribedChats.size]);

  // Handle back to chat management
  const handleBackToChats = useCallback(() => {
    setShowChatSelection(true);
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="bg-[#F9F7F7] rounded-lg border border-[#DBE2EF] shadow flex flex-col items-center justify-center min-h-[220px] py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#DBE2EF] border-t-[#3F72AF] mb-2"></div>
        <div className="text-[#3F72AF] font-semibold text-base">
          Loading Demo Announcements...
        </div>
      </div>
    );
  }

  // Render chat management
  if (showChatSelection) {
    return (
      <div className="bg-[#F9F7F7] rounded-lg border border-[#DBE2EF] shadow p-3 flex flex-col gap-2 w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-[#112D4E] text-base">
            Announcement Sources
          </div>
          {subscribedChats.size > 0 && (
            <button
              onClick={handleViewAnnouncements}
              className="px-3 py-1 bg-[#3F72AF] text-white rounded font-semibold text-xs hover:bg-[#112D4E] transition-colors"
            >
              View Announcements ({subscribedChats.size})
            </button>
          )}
        </div>
        {subscribedChats.size > 0 && (
          <div className="mb-1 p-2 bg-[#DBE2EF] border border-[#DBE2EF] rounded text-[#3F72AF] text-xs font-medium">
            Active: {subscribedChats.size} group
            {subscribedChats.size !== 1 ? "s" : ""}
          </div>
        )}
        <div className="flex-1 min-h-[120px] max-h-64 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-[#3F72AF] py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#DBE2EF] border-t-[#3F72AF] mb-2"></div>
              <div className="text-xs font-medium">Loading group chats...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {chats.map((chat) => {
                const isSubscribed = subscribedChats.has(chat.id);
                return (
                  <div
                    key={chat.id}
                    className={`p-2 rounded border flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md ${
                      isSubscribed
                        ? "bg-[#DBE2EF] border-[#3F72AF]"
                        : "bg-white border-[#DBE2EF] hover:border-[#3F72AF]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSubscribed
                          ? "bg-[#3F72AF] text-white"
                          : "bg-[#DBE2EF] text-[#3F72AF] border border-[#3F72AF]"
                      }`}
                    >
                      {chat.name ? chat.name.charAt(0).toUpperCase() : "G"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#112D4E] text-xs truncate">
                        {chat.name || "Unknown Group"}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-0.5">
                        <span>{chat.participantCount || 0} members</span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#3F72AF] text-white px-2 py-0.5 rounded-full text-[10px]">
                            {chat.unreadCount}
                          </span>
                        )}
                        {isSubscribed && (
                          <span className="bg-[#3F72AF] text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleChatToggle(chat)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors shadow-sm hover:shadow-md ${
                        isSubscribed
                          ? "bg-[#DBE2EF] text-[#3F72AF] border border-[#3F72AF] hover:bg-[#3F72AF] hover:text-white"
                          : "bg-[#3F72AF] text-white hover:bg-[#112D4E]"
                      }`}
                    >
                      {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render announcements view
  return (
    <div className="bg-[#F9F7F7] rounded-lg border border-[#DBE2EF] shadow p-3 flex flex-col gap-2 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-[#112D4E] text-base">Announcements</div>
        <button
          onClick={handleBackToChats}
          className="px-3 py-1 bg-[#3F72AF] text-white rounded font-semibold text-xs hover:bg-[#112D4E] transition-colors"
        >
          Manage Sources
        </button>
      </div>
      <div className="flex-1 min-h-[120px] max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 bg-[#DBE2EF] rounded-full flex items-center justify-center mb-2"></div>
            <div className="font-semibold text-[#112D4E] text-sm mb-1">
              {subscribedChats.size === 0
                ? "No announcement sources configured"
                : "No announcements received yet"}
            </div>
            <div className="text-xs text-gray-600 text-center max-w-xs">
              {subscribedChats.size === 0
                ? "Go to 'Manage Sources' to subscribe to WhatsApp groups and start receiving announcements"
                : "Messages from your subscribed groups will appear here automatically"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-2 bg-white rounded border border-[#DBE2EF] shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#3F72AF] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {msg.from.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#112D4E]">
                        {msg.from}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {msg.chatName}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-9">
                  <div className="text-xs text-gray-800 leading-relaxed break-words">
                    {msg.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
