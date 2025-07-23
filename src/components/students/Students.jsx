import React, { useState, useEffect } from "react";
import { getStudents } from "../../config/api";
import useDebounce from "../../hooks/useDebounce";
import { getAvatarUrl } from "../../utils/avatarHelper";

// Student Card Component
const StudentCard = ({ student, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  // Use avatar helper instead of real photos for privacy protection
  const avatarUrl = getAvatarUrl(student.name, student.id);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
        student.status === "discontinued"
          ? "border-gray-300 bg-gray-50 opacity-75 hover:shadow-md"
          : "border-[#DBE2EF] hover:shadow-lg hover:border-[#3F72AF]"
      }`}
    >
      <div
        className={`p-4 ${student.status === "discontinued" ? "relative" : ""}`}
      >
        {/* Minimal Discontinued Indicator */}
        {student.status === "discontinued" && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              Discontinued
            </span>
          </div>
        )}
        <div className="flex items-start gap-4">
          <div
            className={`hidden md:flex w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 items-center justify-center ${
              student.status === "discontinued"
                ? "border-gray-400"
                : "border-[#3F72AF]"
            }`}
          >
            <img
              src={avatarUrl}
              alt={`${student.name}'s avatar`}
              className={`w-full h-full object-cover ${
                student.status === "discontinued" ? "grayscale opacity-60" : ""
              }`}
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex-1">
            <h3
              className={`font-bold text-lg truncate ${
                student.status === "discontinued"
                  ? "text-gray-500"
                  : "text-[#112D4E]"
              }`}
            >
              {student.name}
            </h3>
            <p
              className={`text-sm ${
                student.status === "discontinued"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {student.roll_number}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                student.status === "discontinued"
                  ? "text-gray-400"
                  : "text-[#3F72AF]"
              }`}
            >
              {student.department}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  student.status === "discontinued"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-[#DBE2EF] text-[#112D4E]"
                }`}
              >
                Year {student.year}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  student.status === "discontinued"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-[#F9F7F7] text-[#3F72AF] border border-[#3F72AF]"
                }`}
              >
                Section {student.section}
              </span>
              {/* Status Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  student.status === "active"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : student.status === "discontinued"
                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                    : student.status === "inactive"
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {student.status === "active"
                  ? "Active"
                  : student.status === "discontinued"
                  ? "Discontinued"
                  : student.status === "inactive"
                  ? "Inactive"
                  : student.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onViewDetails(student)}
            className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Student Details Modal
const StudentDetailsModal = ({ student, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !student) return null;

  // Use avatar helper instead of real photos for privacy protection
  const avatarUrl = getAvatarUrl(student.name, student.id);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20 pb-24 md:pt-8 md:pb-8 md:items-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#F9F7F7] rounded-lg shadow-xl max-w-2xl w-full max-h-full md:max-h-[90vh] overflow-y-auto border border-[#3F72AF] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#112D4E]">
              Student Details
            </h2>
            <button
              onClick={onClose}
              className="text-[#3F72AF] hover:text-[#112D4E] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Student Photo Section */}
          <div className="flex justify-center mb-6">
            <div
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-lg ${
                student.status === "discontinued"
                  ? "border-gray-400"
                  : "border-[#3F72AF]"
              }`}
            >
              <img
                src={avatarUrl}
                alt={`${student.name}'s avatar`}
                className={`w-full h-full object-cover ${
                  student.status === "discontinued"
                    ? "grayscale opacity-60"
                    : ""
                }`}
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Personal Information */}
            <div
              className={`border rounded-lg px-4 py-3 shadow-sm mb-4 ${
                student.status === "discontinued"
                  ? "bg-gray-50 border-gray-300"
                  : "bg-[#F9F7F7] border-[#DBE2EF]"
              }`}
            >
              <h3
                className={`text-base md:text-lg font-semibold mb-3 ${
                  student.status === "discontinued"
                    ? "text-gray-600"
                    : "text-[#112D4E]"
                }`}
              >
                Personal Information
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Name
                  </label>
                  <p
                    className={`font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }`}
                  >
                    {student.name}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Roll Number
                  </label>
                  <p
                    className={`font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }`}
                  >
                    {student.roll_number}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Date of Birth
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {new Date(student.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Gender
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div
              className={`border rounded-lg px-4 py-3 shadow-sm mb-4 ${
                student.status === "discontinued"
                  ? "bg-gray-50 border-gray-300"
                  : "bg-[#F9F7F7] border-[#DBE2EF]"
              }`}
            >
              <h3
                className={`text-base md:text-lg font-semibold mb-3 ${
                  student.status === "discontinued"
                    ? "text-gray-600"
                    : "text-[#112D4E]"
                }`}
              >
                Academic Information
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Department
                  </label>
                  <p
                    className={`font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }`}
                  >
                    {student.department}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Batch
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.batch}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Year
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.year}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Section
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.section}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.status === "active"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : student.status === "discontinued"
                          ? "bg-gray-100 text-gray-600 border border-gray-300"
                          : student.status === "inactive"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {student.status === "active"
                        ? "Active"
                        : student.status === "discontinued"
                        ? "Discontinued"
                        : student.status === "inactive"
                        ? "Inactive"
                        : student.status || "Unknown"}
                    </span>
                    {student.status === "discontinued" && (
                      <span className="text-xs text-gray-500 italic">
                        No longer enrolled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className={`border rounded-lg px-4 py-3 shadow-sm mb-4 ${
                student.status === "discontinued"
                  ? "bg-gray-50 border-gray-300"
                  : "bg-[#F9F7F7] border-[#DBE2EF]"
              }`}
            >
              <h3
                className={`text-base md:text-lg font-semibold mb-3 ${
                  student.status === "discontinued"
                    ? "text-gray-600"
                    : "text-[#112D4E]"
                }`}
              >
                Contact Information
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Email
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.email}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Phone
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.phone}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Address
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.address}{" "}
                    {/* {student.address.street}, {student.address.city},{" "} */}
                    {/* {student.address.state} - {student.address.pincode} */}
                  </p>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div
              className={`border rounded-lg px-4 py-3 shadow-sm mb-4 ${
                student.status === "discontinued"
                  ? "bg-gray-50 border-gray-300"
                  : "bg-[#F9F7F7] border-[#DBE2EF]"
              }`}
            >
              <h3
                className={`text-base md:text-lg font-semibold mb-3 ${
                  student.status === "discontinued"
                    ? "text-gray-600"
                    : "text-[#112D4E]"
                }`}
              >
                Parent/Guardian Information
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Father's Name
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.parent_contact?.father_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Father's Phone
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.parent_contact?.father_phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Mother's Name
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.parent_contact?.mother_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      student.status === "discontinued"
                        ? "text-gray-500"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    Mother's Phone
                  </label>
                  <p
                    className={
                      student.status === "discontinued"
                        ? "text-gray-600"
                        : "text-[#112D4E]"
                    }
                  >
                    {student.parent_contact?.mother_phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg hover:bg-[#112D4E] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Component
const StudentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        {/* <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-transparent bg-white"
          >
            <option value="all">All Students</option>
            <option value="active">Active Only</option>
            <option value="discontinued">Discontinued Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div> */}
      </div>
    </div>
  );
};

// Main Students Component
const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data.students);
      setFilteredStudents(data.students);
      setError(null);
    } catch (err) {
      // console.error("Error fetching students:", err);
      setError("Failed to load students data");
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term and status
  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          student.roll_number
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [debouncedSearchTerm, students, statusFilter]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#F9F7F7] rounded-lg shadow-sm border border-[#3F72AF] p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F72AF] mx-auto mb-4"></div>
              <p className="text-[#3F72AF]">Loading students...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-800">
              Loading Failed
            </h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={fetchStudents}
                className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg hover:bg-[#112D4E] transition-colors"
              >
                Retry
              </button>
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
          Student Directory
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse and manage student information. Total Students:{" "}
          <span className="font-semibold text-[#3F72AF]">
            {students.length}
          </span>
        </p>
      </div>

      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="bg-transparent p-0">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F72AF] mx-auto mb-4"></div>
            <p className="text-[#3F72AF]">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No students found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No students found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Students;
