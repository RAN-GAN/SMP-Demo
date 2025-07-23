import { createContext, useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get user from localStorage
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("faculty_portal_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      // console.error("Error reading user from localStorage:", error);
      return null;
    }
  };

  // Helper function to save user to localStorage
  const saveUserToStorage = (userData) => {
    try {
      if (userData) {
        localStorage.setItem("faculty_portal_user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("faculty_portal_user");
        // Also clear old localStorage key if it exists
        localStorage.removeItem("user");
        localStorage.removeItem("student_portal_user");
      }
    } catch (error) {
      // console.error("Error saving user to localStorage:", error);
    }
  };

  // Demo faculty profiles using faker.js
  const generateDemoFaculty = () => {
    return [
      {
        id: "demo-001",
        employee_id: "demo123",
        email: "demo@university.edu",
        name: "Dr. Demo Professor",
        department: "Computer Science",
        designation: "Professor",
        specialization: ["Software Engineering", "Web Development"],
        phone: faker.phone.number(),
        courses_teaching: [
          {
            course_code: "CS101",
            course_name: "Introduction to Programming",
            semester: 1,
            year: 1,
          },
        ],
        password: "demo", // For demo purposes only
      },
      {
        id: "demo-002",
        employee_id: "faculty456",
        email: "faculty@university.edu",
        name: "Prof. Jane Smith",
        department: "Information Technology",
        designation: "Associate Professor",
        specialization: ["Data Science", "Machine Learning"],
        phone: faker.phone.number(),
        courses_teaching: [
          {
            course_code: "IT201",
            course_name: "Database Systems",
            semester: 2,
            year: 2,
          },
        ],
        password: "demo",
      },
    ];
  };

  const demoFaculty = generateDemoFaculty();

  // Check login status on first load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // console.log("Initializing demo user...");
        setLoading(true);

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Try to get user from localStorage
        const storedUser = getUserFromStorage();
        if (storedUser) {
          // console.log("Found user in localStorage:", storedUser);
          setUser(storedUser);
        } else {
          // Auto-login with demo user for demonstration
          const demoUser = {
            id: demoFaculty[0].id,
            employee_id: demoFaculty[0].employee_id,
            email: demoFaculty[0].email,
            name: demoFaculty[0].name,
            department: demoFaculty[0].department,
            designation: demoFaculty[0].designation,
            specialization: demoFaculty[0].specialization,
            phone: demoFaculty[0].phone,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoFaculty[0].name}`,
            welcomeMessage: `Welcome back, ${demoFaculty[0].name}!`,
            lastLogin: new Date().toISOString(),
            permissions: [
              "view_students",
              "manage_announcements",
              "access_tools",
            ],
          };
          setUser(demoUser);
          // console.log("Auto-logged in with demo user");
        }
      } catch (error) {
        // console.log("Demo initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    }
  }, [user]);

  const login = async (email, employee_id, password) => {
    try {
      // console.log("Attempting demo login with:", email, employee_id);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find matching faculty from demo data
      const faculty = demoFaculty.find(
        (f) =>
          f.email.toLowerCase() === email.toLowerCase() &&
          f.employee_id === employee_id &&
          f.password === password
      );

      if (!faculty) {
        throw new Error(
          "Invalid credentials. Try: demo@university.edu / demo123 / demo"
        );
      }

      // Create user session data
      const userData = {
        id: faculty.id,
        employee_id: faculty.employee_id,
        email: faculty.email,
        name: faculty.name,
        department: faculty.department,
        designation: faculty.designation,
        specialization: faculty.specialization,
        phone: faculty.phone,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.name}`,
        welcomeMessage: `Welcome back, ${faculty.name}!`,
        lastLogin: new Date().toISOString(),
        permissions: ["view_students", "manage_announcements", "access_tools"],
      };

      setUser(userData);
      saveUserToStorage(userData);
      // console.log("Demo login successful:", userData);
      return userData;
    } catch (error) {
      // console.error("Demo login failed:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      // console.log("Logging out demo user...");

      // Clear user data
      setUser(null);
      saveUserToStorage(null);

      // console.log("Demo logout successful");
    } catch (error) {
      // console.error("Logout failed:", error);
    } finally {
      // Always clear user state and localStorage
      setUser(null);
      saveUserToStorage(null);
    }
  };

  const refresh = async () => {
    try {
      // Simulate refresh
      if (user) {
        const updatedUser = {
          ...user,
          lastActivity: new Date().toISOString(),
        };
        setUser(updatedUser);
        saveUserToStorage(updatedUser);
      }
    } catch (error) {
      // console.error("Refresh failed:", error);
      setUser(null);
      saveUserToStorage(null);
      throw error;
    }
  };

  // Helper function to update user activity
  const updateActivity = () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastActivity: new Date().toISOString(),
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refresh,
        loading,
        updateActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
