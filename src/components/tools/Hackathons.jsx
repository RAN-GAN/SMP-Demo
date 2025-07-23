import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate mock hackathons using faker.js
  const generateMockHackathons = () => {
    const hackathons = [];
    for (let i = 0; i < 10; i++) {
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

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockHackathons = generateMockHackathons();
        setHackathons(mockHackathons);
        setError(null);
      } catch (err) {
        // console.error("❌ Error generating hackathons:", err);
        setError("Failed to generate hackathon data. Please refresh the page.");
        setHackathons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

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

This looks like an amazing opportunity to showcase our skills and learn new technologies! 

#Hackathon #Innovation #Technology`;

    navigator.clipboard.writeText(message).then(
      () => {
        alert("Message copied to clipboard!");
      },
      (err) => {
        // console.error("Failed to copy message: ", err);
        // Fallback for browsers that don't support clipboard API or if it fails
        // console.log("Generated Message:", message);
        alert("Message logged to console. Please copy it manually.");
      }
    );
  };

  const HackathonModal = () => {
    if (!isModalOpen || !selectedHackathon) return null;

    return (
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
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
                  <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
                  Dates
                </h3>
                <p className="text-gray-700">
                  {selectedHackathon.submission_period_dates}
                </p>
              </div>

              {/* Participants */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <i className="fas fa-users text-green-500 mr-2"></i>
                  Participants
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
                      <i className="fas fa-tags text-purple-500 mr-2"></i>
                      Themes
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
                      <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                      Prizes
                    </h3>
                    <div className="space-y-1">
                      {selectedHackathon.prizes.map((prize, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-700">{prize.title}:</span>
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
                <i className="fas fa-external-link-alt mr-2"></i>
                Visit Hackathon
              </a>
              <button
                onClick={() => sendMessage(selectedHackathon)}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Generate Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-md">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <i className="fas fa-code text-blue-600 mr-3"></i>
            Upcoming Hackathons
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading hackathons...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
              <div>
                <h3 className="text-red-800 font-semibold">
                  Error Generating Hackathons
                </h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hackathons Grid */}
        {!loading && hackathons.length > 0 && (
          <div className="space-y-4">
            {hackathons.map((hackathon, idx) => (
              <div
                key={hackathon.id || idx}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    {hackathon.thumbnail_url && (
                      <img
                        src={hackathon.thumbnail_url}
                        alt={hackathon.title}
                        className="w-full sm:w-32 h-24 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {hackathon.title}
                      </h3>

                      {/* Tagline */}
                      <p className="text-blue-600 font-medium mb-2 line-clamp-1">
                        {hackathon.tagline}
                      </p>

                      {/* Date and Participants */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt text-blue-500 mr-1"></i>
                          <span>{hackathon.submission_period_dates}</span>
                        </div>
                        {hackathon.registrations_count && (
                          <div className="flex items-center">
                            <i className="fas fa-users text-green-500 mr-1"></i>
                            <span>
                              {hackathon.registrations_count} participants
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Themes */}
                      {hackathon.themes && hackathon.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hackathon.themes
                            .slice(0, 4)
                            .map((theme, themeIdx) => (
                              <span
                                key={themeIdx}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                              >
                                {theme.name || theme}
                              </span>
                            ))}
                          {hackathon.themes.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{hackathon.themes.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(hackathon)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <i className="fas fa-expand-alt mr-2"></i>
                          Details
                        </button>
                        <button
                          onClick={() => sendMessage(hackathon)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          <i className="fas fa-paper-plane mr-2"></i>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hackathons.length === 0 && !error && (
          <div className="text-center py-20">
            <i className="fas fa-calendar-times text-gray-400 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Hackathons Found
            </h3>
            <p className="text-gray-500">
              Check back later for upcoming events!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <HackathonModal />
    </div>
  );
}

export default Hackathons;
