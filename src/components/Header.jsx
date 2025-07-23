import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DotGrid from "./Effects/DotGrid";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Computer Science",
    designation: "Associate Professor",
  };

  return (
    <header className="relative z-50 bg-[#10375c]">
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none overflow-hidden">
        <DotGrid
          dotSize={3}
          gap={4}
          baseColor="#ffffff"
          activeColor="#DBE2EF"
          proximity={40}
          shockRadius={120}
          shockStrength={6}
          resistance={50}
          returnDuration={1}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                <Link
                  to="/"
                  className="hover:text-[#DBE2EF] transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fas fa-graduation-cap text-[#DBE2EF]"></i>
                  <span className="hidden sm:inline">
                    Student Management Portal
                  </span>
                  <span className="sm:hidden">SMP</span>
                  <span className="ml-2 text-xs bg-[#DBE2EF] text-[#10375c] px-2 py-1 rounded-full">
                    DEMO
                  </span>
                </Link>
              </h1>
            </div>

            <nav className="flex items-center gap-4">
              <Link
                to="/students"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#0e2e4f] hover:text-[#DBE2EF] transition-all duration-200"
              >
                <i className="fas fa-users text-sm"></i>
                Students
              </Link>

              <div className="relative">
                {/* Button that toggles dropdown */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0e2e4f] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DBE2EF] focus:ring-opacity-50 text-white"
                >
                  <div className="w-10 h-10 rounded-full bg-[#DBE2EF] flex items-center justify-center shadow-md overflow-hidden border-2 border-white">
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fas fa-user text-[#3F72AF] text-sm"></i>
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold text-sm leading-tight">
                      {user.name}
                    </div>
                    <div className="text-xs text-[#DBE2EF] leading-tight">
                      {user.designation}
                    </div>
                  </div>
                  <i
                    className={`fas fa-chevron-down text-xs text-[#DBE2EF] transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-[9998]"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[9999]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Demo Mode</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <i className="fas fa-user-circle text-gray-400"></i>
                          View Profile
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
