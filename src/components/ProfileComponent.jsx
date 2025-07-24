import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../config/api";
import { getAvatarUrl } from "../utils/avatarHelper";

function ProfileComponent() {
  const { user, logout } = useAuth();
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [clickStats, setClickStats] = useState(null);
  const [clickLoading, setClickLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
    fetchClickStats();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const profile = await getProfile();
      setFacultyData(profile);
    } catch (error) {
      // console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClickStats = async () => {
    try {
      setClickLoading(true);
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/click-stats`);
      const data = await response.json();

      if (data.success) {
        setClickStats(data);
      } else {
        console.error("Failed to fetch click stats:", data.error);
      }
    } catch (err) {
      console.error("Error fetching click stats:", err);
    } finally {
      setClickLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the AuthContext/App routing
    } catch (error) {
      // console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Get header click stats for easier access
  const headerClickStats = clickStats?.stats?.find(
    (stat) => stat.element === "main-header"
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#F9F7F7] rounded-lg shadow-md p-6 border border-[#3F72AF]">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F72AF] mx-auto mb-4"></div>
              <p className="text-[#3F72AF]">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#112D4E] tracking-tight">
          Faculty Profile
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Your personal and professional information
        </p>
      </div>

      {/* Profile Header Section */}
      <div className="bg-[#F9F7F7] rounded-lg shadow-md border border-[#DBE2EF] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3F72AF] shadow-lg">
              <img
                src={getAvatarUrl(
                  facultyData?.name || user?.name || "Faculty",
                  facultyData?.id || user?.id || 1
                )}
                alt={`${facultyData?.name || user?.name || "Faculty"}'s avatar`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#112D4E] mb-2">
              {facultyData?.name || user?.name || "Faculty Member"}
            </h2>
            <p className="text-lg text-[#3F72AF] font-semibold mb-1">
              {facultyData?.designation ||
                user?.designation ||
                "Faculty Member"}
            </p>
            <p className="text-[#3F72AF] mb-2">
              {facultyData?.department || user?.department || "Department"}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  (facultyData?.status || "active") === "active"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {(facultyData?.status || "active") === "active"
                  ? "Active"
                  : "Inactive"}
              </span>
              <span className="px-3 py-1 bg-[#DBE2EF] text-[#112D4E] rounded-full text-sm font-semibold">
                ID: {facultyData?.employee_id || user?.employee_id || "N/A"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <button className="bg-[#3F72AF] hover:bg-[#112D4E] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm hover:shadow-md hover:cursor-not-allowed">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
          <h3 className="text-xl font-semibold text-[#112D4E] mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Full Name
              </label>
              <p className="text-[#112D4E] font-medium">
                {facultyData?.name || user?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Employee ID
              </label>
              <p className="text-[#112D4E] font-medium">
                {facultyData?.employee_id || user?.employee_id || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Email Address
              </label>
              <p className="text-[#112D4E]">
                {facultyData?.email || user?.email || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Phone Number
              </label>
              <p className="text-[#112D4E]">
                {facultyData?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Faculty Status
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  (facultyData?.status || "active") === "active"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {(facultyData?.status || "active") === "active"
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
          <h3 className="text-xl font-semibold text-[#112D4E] mb-4">
            Professional Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Department
              </label>
              <p className="text-[#112D4E] font-medium">
                {facultyData?.department || user?.department || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Designation
              </label>
              <p className="text-[#112D4E]">
                {facultyData?.designation || "Faculty Member"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Qualification
              </label>
              <p className="text-[#112D4E]">
                {facultyData?.qualification || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Experience
              </label>
              <p className="text-[#112D4E]">
                {facultyData?.experience
                  ? `${facultyData.experience} years`
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Specialization & Teaching */}
        <div className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
          <h3 className="text-xl font-semibold text-[#112D4E] mb-4">
            Specialization & Research
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-2">
                Areas of Specialization
              </label>
              {facultyData?.specialization &&
              Array.isArray(facultyData.specialization) &&
              facultyData.specialization.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {facultyData.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#DBE2EF] text-[#112D4E] rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : facultyData?.specialization &&
                typeof facultyData.specialization === "string" ? (
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#DBE2EF] text-[#112D4E] rounded-full text-sm font-medium">
                    {facultyData.specialization}
                  </span>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No specializations listed
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Research Profile
              </label>
              {facultyData?.research_id ? (
                <a
                  className="text-[#3F72AF] hover:text-[#112D4E] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={facultyData.research_id}
                >
                  View Research Profile{" "}
                  <i className="fas fa-external-link-alt ml-1"></i>
                </a>
              ) : (
                <p className="text-gray-500 italic">
                  No research profile available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
          <h3 className="text-xl font-semibold text-[#112D4E] mb-4">
            Current Courses Teaching
          </h3>
          {facultyData?.courses_teaching &&
          Array.isArray(facultyData.courses_teaching) &&
          facultyData.courses_teaching.length > 0 ? (
            <div className="space-y-3">
              {facultyData.courses_teaching.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-[#DBE2EF]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#112D4E]">
                        {course.course_name}
                      </h4>
                      <p className="text-sm text-[#3F72AF]">
                        {course.course_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#3F72AF]">
                        Year {course.year} • Semester {course.semester}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No courses assigned</p>
          )}
        </div>
      </div>

      {/* Click Statistics */}
      <div className="mt-6 bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
        <h3 className="text-xl font-semibold text-[#112D4E] mb-4 flex items-center">
          <i className="fas fa-mouse-pointer mr-2 text-[#3F72AF]"></i>
          Usage Statistics
        </h3>

        {clickLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3F72AF]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Header Clicks
              </label>
              <p className="text-2xl font-bold text-[#112D4E]">
                {headerClickStats?.count || 0}
              </p>
              {headerClickStats?.lastClicked && (
                <p className="text-xs text-gray-500">
                  Last:{" "}
                  {new Date(headerClickStats.lastClicked).toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3F72AF] mb-1">
                Total Interactions
              </label>
              <p className="text-2xl font-bold text-[#112D4E]">
                {clickStats?.totalClicks || 0}
              </p>
              <p className="text-xs text-gray-500">
                Across {clickStats?.totalElements || 0} elements
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={fetchClickStats}
                className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg hover:bg-[#112D4E] transition-colors text-sm"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh Stats
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Information */}
      <div className="mt-6 bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg px-6 py-4 shadow-sm">
        <h3 className="text-xl font-semibold text-[#112D4E] mb-4">
          Session Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3F72AF] mb-1">
              Login Time
            </label>
            <p className="text-[#112D4E]">
              {user?.loginTime
                ? new Date(user.loginTime).toLocaleString()
                : "Not available"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3F72AF] mb-1">
              Last Activity
            </label>
            <p className="text-[#112D4E]">
              {user?.lastActivity
                ? new Date(user.lastActivity).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
