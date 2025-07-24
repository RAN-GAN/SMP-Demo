import { generateAllFakeData } from "../utils/fakeDataGenerator.js";

// Generate all fake data once and store it
const fakeData = generateAllFakeData();

// Helper function to simulate API delay
const simulateDelay = (min = 300, max = 800) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Mock API functions
export const mockAPI = {
  // Students API
  async getStudents(filters = {}) {
    await simulateDelay();
    let students = fakeData.students.students;

    // Apply filters
    if (filters.department) {
      students = students.filter((s) => s.department === filters.department);
    }
    if (filters.batch) {
      students = students.filter((s) => s.batch === filters.batch);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.roll_number.toLowerCase().includes(searchTerm) ||
          s.email.toLowerCase().includes(searchTerm)
      );
    }

    return { students, totalCount: students.length };
  },

  async getStudentById(studentId) {
    await simulateDelay();
    const student = fakeData.students.students.find(
      (s) => s.id === parseInt(studentId)
    );
    if (!student) throw new Error(`Student with ID ${studentId} not found`);
    return student;
  },

  // Faculty API
  async getFaculty() {
    await simulateDelay();
    return fakeData.faculty;
  },

  // Courses API
  async getCourses() {
    await simulateDelay();
    return fakeData.courses;
  },

  // Announcements API
  async getAnnouncements() {
    await simulateDelay();
    return fakeData.announcements;
  },

  async addAnnouncement(announcement) {
    await simulateDelay();
    const newAnnouncement = {
      id: fakeData.announcements.announcements.length + 1,
      ...announcement,
      created_at: new Date().toISOString(),
      is_active: true,
    };
    fakeData.announcements.announcements.unshift(newAnnouncement);
    return { success: true, announcement: newAnnouncement };
  },

  // Attendance API
  async getAttendance(studentId, courseId) {
    await simulateDelay();
    let attendance = fakeData.attendance.attendance;

    if (studentId) {
      attendance = attendance.filter(
        (a) => a.student_id === parseInt(studentId)
      );
    }
    if (courseId) {
      attendance = attendance.filter((a) => a.course_id === parseInt(courseId));
    }

    return { attendance };
  },

  async markAttendance(attendanceData) {
    await simulateDelay();
    const newRecord = {
      id: fakeData.attendance.attendance.length + 1,
      ...attendanceData,
      marked_at: new Date().toISOString(),
    };
    fakeData.attendance.attendance.push(newRecord);
    return { success: true, ...newRecord };
  },

  // Grades API
  async getGrades(studentId) {
    await simulateDelay();
    let grades = fakeData.grades.grades;

    if (studentId) {
      grades = grades.filter((g) => g.student_id === parseInt(studentId));
    }

    return { grades };
  },

  async updateGrade(gradeData) {
    await simulateDelay();
    const gradeIndex = fakeData.grades.grades.findIndex(
      (g) => g.id === gradeData.id
    );
    if (gradeIndex !== -1) {
      fakeData.grades.grades[gradeIndex] = {
        ...fakeData.grades.grades[gradeIndex],
        ...gradeData,
      };
    }
    return { success: true, ...gradeData };
  },

  // Timetable API
  async getTimetable() {
    await simulateDelay();
    return fakeData.timetable;
  },

  async updateTimetable(newTimetable) {
    await simulateDelay();
    fakeData.timetable = newTimetable;
    return { success: true, message: "Timetable updated successfully" };
  },

  // Calendar API
  async getCalendar(year, month) {
    await simulateDelay();
    // Generate calendar for specific month if requested
    if (year && month) {
      const { generateCalendarEvents } = await import(
        "../utils/fakeDataGenerator.js"
      );
      return generateCalendarEvents(parseInt(year), parseInt(month));
    }
    return fakeData.calendar;
  },

  // Profile API (for faculty profile)
  async getProfile() {
    await simulateDelay();
    // Return profile data that matches the demo user from AuthContext
    return {
      id: "demo-001",
      name: "Dr. Demo Professor",
      email: "demo@university.edu",
      employee_id: "demo123",
      department: "Computer Science",
      designation: "Professor",
      phone: "+1 (555) 123-4567",
      office: "Room 301",
      qualification: "Ph.D in Computer Science",
      experience: "15 years",
      specialization: ["Software Engineering", "Web Development"],
      courses_teaching: [
        {
          course_code: "CS101",
          course_name: "Introduction to Programming",
          semester: 1,
          year: 1,
        },
        {
          course_code: "CS201",
          course_name: "Data Structures",
          semester: 2,
          year: 2,
        },
      ],
      photo_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr. Demo Professor",
      bio: "Experienced faculty member dedicated to student success and academic excellence. Specializes in software engineering and web development with over 15 years of teaching and research experience.",
      achievements: [
        "Published 25+ research papers",
        "Received Best Teacher Award 2023",
        "Led 5 industry-sponsored projects",
      ],
      social_links: {
        linkedin: "https://linkedin.com/in/demo-professor",
        google_scholar: "https://scholar.google.com/demo-professor",
        researchgate: "https://researchgate.net/profile/demo-professor",
      },
      status: "active",
    };
  },

  // Research News API (mock)
  async getResearchNews(specialization = null, limit = 6) {
    await simulateDelay();
    const mockNews = [
      {
        title: "Breakthrough in Quantum Computing Architecture",
        description:
          "Researchers develop new quantum computing architecture that could revolutionize computational capabilities...",
        source: "Tech Research Today",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/quantum-breakthrough",
        urlToImage:
          "https://via.placeholder.com/400x200?text=Quantum+Computing",
        category: "Technology",
      },
      {
        title: "AI-Powered Drug Discovery Shows Promise",
        description:
          "Machine learning algorithms are accelerating pharmaceutical research and drug development processes...",
        source: "Science Daily",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/ai-drug-discovery",
        urlToImage: "https://via.placeholder.com/400x200?text=AI+Research",
        category: "Healthcare",
      },
      {
        title: "Sustainable Computing: Green Data Centers",
        description:
          "New technologies are making data centers more energy-efficient and environmentally friendly...",
        source: "Green Tech Review",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/green-data-centers",
        urlToImage: "https://via.placeholder.com/400x200?text=Green+Computing",
        category: "Environment",
      },
      {
        title: "Advances in Computer Vision and Image Recognition",
        description:
          "Latest developments in deep learning are pushing the boundaries of what's possible in image recognition...",
        source: "AI Research Journal",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/computer-vision",
        urlToImage: "https://via.placeholder.com/400x200?text=Computer+Vision",
        category: "AI/ML",
      },
      {
        title: "Blockchain Technology in Supply Chain Management",
        description:
          "How blockchain is transforming supply chain transparency and traceability across industries...",
        source: "Blockchain Today",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/blockchain-supply-chain",
        urlToImage: "https://via.placeholder.com/400x200?text=Blockchain",
        category: "Technology",
      },
      {
        title: "Cybersecurity in the Age of IoT",
        description:
          "Addressing security challenges as Internet of Things devices become increasingly prevalent...",
        source: "Cyber Security Weekly",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: "https://example.com/iot-security",
        urlToImage: "https://via.placeholder.com/400x200?text=IoT+Security",
        category: "Security",
      },
    ];

    return {
      success: true,
      articles: mockNews.slice(0, limit),
      totalResults: mockNews.length,
      specialization: specialization || "General Computer Science",
      source: "Mock Data",
    };
  },

  // Hackathons API (mock)
  async getHackathons(limit = 6) {
    await simulateDelay();
    const mockHackathons = [
      {
        id: 1,
        title: "Tech Innovation Challenge 2025",
        tagline: "Build the future with cutting-edge technology",
        thumbnail_url: "https://via.placeholder.com/300x200?text=Hackathon",
        url: "https://example.com/hackathon1",
        submission_period_dates: "Jan 15 - Jan 17, 2025",
        themes: [{ name: "AI/ML" }, { name: "Web Dev" }, { name: "Mobile" }],
        prizes: [{ title: "1st Place", amount: "$5,000" }],
        registrations_count: 1250,
        description:
          "Join us for an exciting 48-hour hackathon where you'll build innovative solutions using the latest technologies.",
      },
      {
        id: 2,
        title: "Green Tech Hackathon",
        tagline: "Coding for a sustainable future",
        thumbnail_url: "https://via.placeholder.com/300x200?text=Green+Tech",
        url: "https://example.com/hackathon2",
        submission_period_dates: "Feb 10 - Feb 12, 2025",
        themes: [{ name: "Sustainability" }, { name: "Clean Energy" }],
        prizes: [{ title: "Grand Prize", amount: "$10,000" }],
        registrations_count: 890,
        description:
          "Create innovative solutions for environmental challenges.",
      },
      {
        id: 3,
        title: "Fintech Innovation Sprint",
        tagline: "Revolutionize financial technology",
        thumbnail_url: "https://via.placeholder.com/300x200?text=Fintech",
        url: "https://example.com/hackathon3",
        submission_period_dates: "Mar 5 - Mar 7, 2025",
        themes: [
          { name: "Blockchain" },
          { name: "Payments" },
          { name: "Banking" },
        ],
        prizes: [{ title: "Winner", amount: "$7,500" }],
        registrations_count: 650,
        description:
          "Transform the future of finance with innovative solutions.",
      },
    ];

    return {
      success: true,
      hackathons: mockHackathons.slice(0, limit),
      count: Math.min(mockHackathons.length, limit),
      source: "Mock Data",
      timestamp: new Date().toISOString(),
    };
  },
};

// Export individual functions for backward compatibility
export const getStudents = mockAPI.getStudents;
export const getStudentById = mockAPI.getStudentById;
export const getFaculty = mockAPI.getFaculty;
export const getCourses = mockAPI.getCourses;
export const getAnnouncements = mockAPI.getAnnouncements;
export const addAnnouncement = mockAPI.addAnnouncement;
export const getAttendance = mockAPI.getAttendance;
export const markAttendance = mockAPI.markAttendance;
export const getGrades = mockAPI.getGrades;
export const updateGrade = mockAPI.updateGrade;
export const getTimetable = mockAPI.getTimetable;
export const updateTimetable = mockAPI.updateTimetable;
export const getCalendar = mockAPI.getCalendar;
export const getProfile = mockAPI.getProfile;

// Add these as default exports as well
export default mockAPI;
