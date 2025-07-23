// Mock API configuration for the Student Management Portal Demo
import mockAPI from "../utils/mockAPI.js";

// Export all API functions from mockAPI
export const {
  getStudents,
  getStudentById,
  getFaculty,
  getCourses,
  getAnnouncements,
  addAnnouncement,
  getAttendance,
  markAttendance,
  getGrades,
  updateGrade,
  getTimetable,
  updateTimetable,
  getCalendar,
  getProfile,
} = mockAPI;

// Additional helper functions
export const getStudent = async (studentId) => {
  const student = await getStudentById(studentId);
  return { student };
};

// Utility functions for data processing
export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;

  const gradePoints = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  };

  const totalPoints = grades.reduce((sum, grade) => {
    const points = gradePoints[grade.grade] || 0;
    return sum + points * (grade.credits || 3);
  }, 0);

  const totalCredits = grades.reduce(
    (sum, grade) => sum + (grade.credits || 3),
    0
  );

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;

  const presentCount = attendanceRecords.filter(
    (record) => record.status === "present"
  ).length;
  return ((presentCount / attendanceRecords.length) * 100).toFixed(2);
};

// Error handling utility
export const handleApiError = (
  error,
  fallbackMessage = "An error occurred"
) => {
  // console.error("API Error:", error);

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Network error. Please check your connection.";
  }

  if (error.message.includes("404")) {
    return "Requested data not found.";
  }

  if (error.message.includes("500")) {
    return "Server error. Please try again later.";
  }

  return error.message || fallbackMessage;
};

// Mock student update function
export const updateStudent = async (studentId, studentData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, id: studentId, ...studentData };
};
