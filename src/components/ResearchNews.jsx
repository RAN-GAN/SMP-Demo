import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useAuth } from "../context/AuthContext";

function ResearchNews() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default topics for demo
  const defaultTopics = ["Computer Science", "Research", "Technology"];
  const topics = user?.specialization
    ? [user.specialization, user.department, "Research"]
    : defaultTopics;

  // Generate mock research news using faker.js
  const generateMockNews = () => {
    const news = [];
    for (let i = 0; i < 6; i++) {
      const topics = [];
      for (let j = 0; j < faker.number.int({ min: 2, max: 4 }); j++) {
        topics.push(faker.science.chemicalElement().name);
      }

      news.push({
        id: i + 1,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(2),
        url: faker.internet.url(),
        urlToImage: `https://picsum.photos/400/250?random=${i}`,
        publishedAt: faker.date.recent().toISOString(),
        source: { name: faker.company.name() },
        author: faker.person.fullName(),
        topics: topics,
      });
    }
    return news;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockNews = generateMockNews();
        setNews(mockNews);
        setError(null);
      } catch (err) {
        // console.error("Error generating news:", err);
        setError("Failed to generate research news");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getCategoryAndIcon = (article) => {
    const title = article.title.toLowerCase();
    const content = (article.description || "").toLowerCase();

    if (
      title.includes("ai") ||
      title.includes("artificial intelligence") ||
      content.includes("artificial intelligence")
    )
      return { category: "AI", icon: "fas fa-brain", color: "bg-[#3F72AF]" };
    if (
      title.includes("education") ||
      title.includes("academic") ||
      content.includes("education")
    )
      return {
        category: "Education",
        icon: "fas fa-graduation-cap",
        color: "bg-[#3F72AF]",
      };
    if (title.includes("research") || content.includes("research"))
      return {
        category: "Research",
        icon: "fas fa-flask",
        color: "bg-[#3F72AF]",
      };
    if (
      title.includes("tech") ||
      title.includes("technology") ||
      content.includes("technology")
    )
      return {
        category: "Technology",
        icon: "fas fa-microchip",
        color: "bg-[#3F72AF]",
      };
    if (
      title.includes("data") ||
      title.includes("science") ||
      content.includes("data")
    )
      return {
        category: "Data Science",
        icon: "fas fa-chart-bar",
        color: "bg-[#3F72AF]",
      };
    return {
      category: "News",
      icon: "fas fa-newspaper",
      color: "bg-[#3F72AF]",
    };
  };

  return (
    <div className="bg-[#DBE2EF] p-4 rounded-lg shadow-sm h-full flex flex-col border border-[#DBE2EF]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#112D4E] flex items-center gap-2">
          <i className="fas fa-newspaper text-[#3F72AF]"></i>
          Research News
        </h2>
        {user && topics !== defaultTopics && (
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-[#DBE2EF] text-[#3F72AF] rounded text-xs font-medium"
              >
                {topic.length > 12 ? `${topic.substring(0, 12)}...` : topic}
              </span>
            ))}
            {topics.length > 2 && (
              <span className="px-2 py-1 bg-[#DBE2EF] text-[#112D4E] rounded text-xs">
                +{topics.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#3F72AF] border-t-transparent mx-auto mb-2"></div>
            <p className="text-[#112D4E] text-sm">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
            <p className="text-red-600 text-sm">Failed to load news</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3 flex-grow overflow-y-auto">
          {news.length > 0 ? (
            news.map((article, idx) => {
              const { category, icon, color } = getCategoryAndIcon(article);
              return (
                <div
                  key={idx}
                  className="border border-[#DBE2EF] rounded-lg p-3 bg-white hover:bg-[#DBE2EF] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {article.urlToImage ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-10 h-10 bg-[#3F72AF] rounded-lg flex items-center justify-center"
                            style={{ display: "none" }}
                          >
                            <i className="fas fa-newspaper text-white text-sm"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-[#3F72AF] rounded-lg flex items-center justify-center">
                          <i className="fas fa-newspaper text-white text-sm"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="font-medium text-[#112D4E] text-sm leading-tight hover:text-[#3F72AF] transition-colors mb-1 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-[#3F72AF]">
                          <span className="truncate">
                            {article.source.name}
                          </span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-grow flex items-center justify-center text-center p-4">
              <div>
                <i className="fas fa-inbox text-[#3F72AF] text-2xl mb-2"></i>
                <p className="text-[#112D4E] text-sm">No news available</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResearchNews;
