import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BottomNav() {
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#3F72AF] h-14 flex justify-around items-center text-[#F9F7F7] font-bold border-t border-[#112D4E] z-50 shadow-lg">
      <Link
        to="/students"
        className="flex flex-col items-center hover:text-[#DBE2EF] transition text-xs"
      >
        <i className="fas fa-users text-lg"></i>
        <span>Students</span>
      </Link>
      <Link
        to="/calendar"
        className="flex flex-col items-center hover:text-[#DBE2EF] transition text-xs"
      >
        <i className="fas fa-calendar-alt text-lg"></i>
        <span>Calendar</span>
      </Link>
      <Link
        to="/internal-marks"
        className="flex flex-col items-center hover:text-[#DBE2EF] transition text-xs"
      >
        <i className="fas fa-clipboard-list text-lg"></i>
        <span>Internal Marks</span>
      </Link>

      {user ? (
        <Link
          to="/profile"
          className="flex flex-col items-center hover:text-[#DBE2EF] transition text-xs"
        >
          <i className="fas fa-user text-lg"></i>
          <span>Profile</span>
        </Link>
      ) : (
        <Link
          to="/login"
          className="flex flex-col items-center hover:text-[#DBE2EF] transition text-xs"
        >
          <i className="fas fa-sign-in-alt text-lg"></i>
          <span>Login</span>
        </Link>
      )}
    </nav>
  );
}

export default BottomNav;
