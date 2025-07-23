import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import StudentDM from "./StudentDM";
import PortionsGraph from "./portions";

const InfoCard = ({ title, value, children }) => (
  <div className="flex flex-col bg-[#F9F7F7] rounded-lg p-3 shadow-sm border border-[#DBE2EF] w-full">
    <div className="text-xs text-[#3F72AF] font-semibold uppercase tracking-wide">
      {title}
    </div>
    <div className="text-base sm:text-lg font-bold text-[#112D4E] mb-1">
      {value}
    </div>
    {children}
  </div>
);

function Tools() {
  const { user } = useAuth();
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDayOrder, setCurrentDayOrder] = useState(null);
  const [activeView, setActiveView] = useState("students"); // New state for active view

  // Hackathons state
  const [hackathons, setHackathons] = useState([]);
  const [hackathonsLoading, setHackathonsLoading] = useState(false);
  const [hackathonsError, setHackathonsError] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayUser = user || {
    name: "Student",
    welcomeMessage: "Welcome to your Dashboard",
  };

  // Generate mock hackathons using faker.js
  const generateMockHackathons = () => {
    const hackathons = [];
    for (let i = 0; i < 6; i++) {
      const themes = [];
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        themes.push({ name: faker.hacker.noun() });
      }

      const prizes = [];
      for (let k = 0; k < faker.number.int({ min: 1, max: 3 }); k++) {
        prizes.push({
          title: `${faker.helpers.arrayElement([
            "1st",
            "2nd",
            "3rd",
            "Grand",
            "Best",
          ])} Prize`,
          amount: `$${faker.number
            .int({ min: 1000, max: 50000 })
            .toLocaleString()}`,
        });
      }

      hackathons.push({
        id: i + 1,
        title: faker.company.buzzPhrase() + " Hackathon",
        tagline: faker.company.catchPhrase(),
        thumbnail_url: `https://picsum.photos/300/200?random=${i}`,
        url: faker.internet.url(),
        submission_period_dates: `${faker.date
          .future()
          .toLocaleDateString()} - ${faker.date.future().toLocaleDateString()}`,
        themes: themes,
        prizes: prizes,
        registrations_count: faker.number.int({ min: 50, max: 2000 }),
        description: faker.lorem.paragraph(3),
      });
    }
    return hackathons;
  };

  // Fetch hackathons when hackathons view is selected
  useEffect(() => {
    if (activeView === "hackathons" && hackathons.length === 0) {
      const fetchHackathons = async () => {
        setHackathonsLoading(true);
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const mockHackathons = generateMockHackathons();
          setHackathons(mockHackathons);
          setHackathonsError(null);
        } catch (err) {
          // console.error("❌ Error generating hackathons:", err);
          setHackathonsError("Failed to generate hackathon data");
        } finally {
          setHackathonsLoading(false);
        }
      };

      fetchHackathons();
    }
  }, [activeView, hackathons.length]);

  // Hackathon helper functions
  const openModal = (hackathon) => {
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHackathon(null);
    setIsModalOpen(false);
  };

  const sendMessage = (hackathon) => {
    const message = `🚀 Exciting Hackathon Opportunity!

  📅 Event: ${hackathon.title}
  💡 Theme: ${hackathon.tagline}
  📆 Dates: ${hackathon.submission_period_dates}
  👥 Participants: ${hackathon.registrations_count || "TBA"} registered
  🏆 Prizes: ${
    hackathon.prizes?.map((p) => `${p.title}: ${p.amount}`).join(", ") ||
    "Multiple prizes available"
  }

  🔗 Learn more: ${hackathon.url}

  This looks like an amazing opportunity to showcase our skills! 

  #Hackathon #Innovation #Technology`;

    navigator.clipboard
      .writeText(message)
      .then(() => {
        alert("Message copied to clipboard!");
      })
      .catch(() => {
        // console.log("Generated Message:", message);
        alert("Message logged to console!");
      });
  };

  return (
    <div className="bg-[#DBE2EF] p-4 sm:p-6 rounded-xl shadow-md mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-[#112D4E] mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-[#3F72AF] rounded-sm mr-2"></span>
        Tools
      </h2>

      {/* 🎯 Action Buttons (with Framer Motion animations) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView("students")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md ${
            activeView === "students"
              ? "bg-[#112D4E] text-white"
              : "bg-[#3F72AF] text-white hover:bg-[#112D4E]"
          }`}
        >
          DM Students
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView("hackathons")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md ${
            activeView === "hackathons"
              ? "bg-[#112D4E] text-white"
              : "bg-[#3F72AF] text-white hover:bg-[#112D4E]"
          }`}
        >
          Send Hackathons
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView("portions")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md ${
            activeView === "portions"
              ? "bg-[#112D4E] text-white"
              : "bg-[#3F72AF] text-white hover:bg-[#112D4E]"
          }`}
        >
          Portions Graph
        </motion.button>
      </div>
      {activeView === "students" && <StudentDM />}
      {activeView === "portions" && <PortionsGraph />}
      {activeView === "hackathons" && (
        <div className="w-full">
          <div className="flex flex-col justify-between p-6 bg-gradient-to-br from-[#DBE2EF] to-[#F9F7FE] rounded-xl border-2 border-[#3F72AF] shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Content */}
            <div className="flex-1 flex items-center justify-center min-h-[180px]">
              <div className="w-full">
                {hackathonsLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3F72AF] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-[#112D4E]">
                      Loading hackathons...
                    </p>
                  </div>
                ) : hackathonsError ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-lg text-red-600 mb-2">
                      Error generating hackathons
                    </p>
                    <p className="text-sm text-[#3F72AF] mb-4">
                      Please try refreshing the page
                    </p>
                  </div>
                ) : hackathons.length === 0 ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-lg text-[#112D4E]">
                      No hackathons available
                    </p>
                  </div>
                ) : null}

                {hackathons.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-[#112D4E] mb-1">
                        🏆 Upcoming Hackathons
                      </h3>
                      <p className="text-sm text-[#3F72AF]">
                        {hackathons.length} opportunities available
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
                      {hackathons.map((hackathon, idx) => (
                        <div
                          key={hackathon.id || idx}
                          className="bg-white rounded-lg shadow-sm border border-[#DBE2EF] p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-[#112D4E] mb-1 line-clamp-1">
                                {hackathon.title}
                              </h4>
                              <p className="text-xs text-[#3F72AF] mb-1 line-clamp-1">
                                {hackathon.tagline}
                              </p>
                              <div className="text-xs text-gray-600 mb-1">
                                📅 {hackathon.submission_period_dates}
                              </div>
                            </div>
                          </div>

                          {hackathon.themes && hackathon.themes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {hackathon.themes
                                .slice(0, 3)
                                .map((theme, themeIdx) => (
                                  <span
                                    key={themeIdx}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                  >
                                    {theme.name || theme}
                                  </span>
                                ))}
                              {hackathon.themes.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{hackathon.themes.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(hackathon)}
                              className="flex-1 bg-[#3F72AF] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#112D4E] transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => sendMessage(hackathon)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700 transition-colors"
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  openModal(
                    hackathons[0] || {
                      title: "Sample Hackathon",
                      tagline: "Explore exciting opportunities!",
                    }
                  )
                }
                className="px-6 py-2 bg-[#3F72AF] text-white rounded-lg font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md"
              >
                Browse Hackathons
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Hackathon Modal */}
      {isModalOpen && selectedHackathon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedHackathon.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Image */}
              {selectedHackathon.thumbnail_url && (
                <img
                  src={selectedHackathon.thumbnail_url}
                  alt={selectedHackathon.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Tagline */}
              <p className="text-lg text-blue-600 font-medium mb-4">
                {selectedHackathon.tagline}
              </p>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedHackathon.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📅 Dates
                  </h3>
                  <p className="text-gray-700">
                    {selectedHackathon.submission_period_dates}
                  </p>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    👥 Participants
                  </h3>
                  <p className="text-gray-700">
                    {selectedHackathon.registrations_count || "TBA"} registered
                  </p>
                </div>

                {/* Themes */}
                {selectedHackathon.themes &&
                  selectedHackathon.themes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        🏷️ Themes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHackathon.themes.map((theme, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {theme.name || theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Prizes */}
                {selectedHackathon.prizes &&
                  selectedHackathon.prizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        🏆 Prizes
                      </h3>
                      <div className="space-y-1">
                        {selectedHackathon.prizes.map((prize, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-700">
                              {prize.title}:
                            </span>
                            <span className="text-green-600 font-semibold">
                              {prize.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={selectedHackathon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  🔗 Visit Hackathon
                </a>
                <button
                  onClick={() => sendMessage(selectedHackathon)}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  📋 Copy Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tools;
