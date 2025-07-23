import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

function GeneralInfo() {
  const { user } = useAuth();
  const [timetableData, setTimetableData] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDayOrder, setCurrentDayOrder] = useState(null);

  const displayUser = user || {
    name: "Student",
    welcomeMessage: "Welcome to your Dashboard",
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const res = await fetch("/timetable.json");
        if (!res.ok) throw new Error("Failed to load timetable");
        const data = await res.json();

        // Check if this is the new faculty-specific structure
        if (data.timetables && user?.email) {
          // console.log(
          //   "Faculty-specific structure detected, user email:",
          //   user.email
          // );
          // Get faculty-specific timetable based on user email
          const facultyTimetable = data.timetables[user.email];
          if (facultyTimetable) {
            // console.log("Found timetable for user:", user.email);
            setTimetableData({
              ...facultyTimetable,
              periods: data.periods, // Use common periods structure
            });
          } else {
            // console.log(
            //   "No timetable found for user:",
            //   user.email,
            //   "Available timetables:",
            //   Object.keys(data.timetables)
            // );
            // Fallback: Use the first available faculty timetable as placeholder
            const firstFacultyEmail = Object.keys(data.timetables)[0];
            if (firstFacultyEmail) {
              // console.log("Using fallback timetable:", firstFacultyEmail);
              setTimetableData({
                ...data.timetables[firstFacultyEmail],
                periods: data.periods,
              });
              // console.warn(
              //   `No timetable found for ${user.email}, using ${firstFacultyEmail} as fallback`
              // );
            } else {
              throw new Error("No faculty timetables available");
            }
          }
        } else {
          // console.log(
          //   "Using legacy single timetable structure or no user email"
          // );
          // Legacy single timetable structure
          setTimetableData(data);
        }
      } catch (err) {
        // console.error("Error fetching timetable:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        // console.log("Final timetableData:", timetableData);
      }
    };
    fetchTimetable();
  }, [user?.email]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const res = await fetch(
          `/calendar_${year}_${String(month).padStart(2, "0")}.json`
        );
        if (!res.ok) {
          const dayOfWeek = today.getDay();
          const defaultDayOrder =
            dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek : null;
          setCurrentDayOrder(defaultDayOrder);
          return;
        }
        const data = await res.json();
        setCalendarData(data);
        const todayEntry = data.days.find((d) => d.date === today.getDate());
        if (todayEntry) {
          if (todayEntry.type === "Working Day" && todayEntry.day_order) {
            setCurrentDayOrder(todayEntry.day_order);
          } else {
            setCurrentDayOrder(null);
          }
        } else {
          setCurrentDayOrder(null);
        }
      } catch (err) {
        // console.error("Error fetching calendar:", err);
        const today = new Date();
        const dayOfWeek = today.getDay();
        const defaultDayOrder =
          dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek : null;
        setCurrentDayOrder(defaultDayOrder);
      }
    };
    fetchCalendar();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentPeriod = () => {
    if (!timetableData?.periods) return null;
    const now = currentTime;
    const currentTimeStr = now.toTimeString().slice(0, 5);
    for (const period of timetableData.periods) {
      if (
        currentTimeStr >= period.startTime &&
        currentTimeStr < period.endTime
      ) {
        return period;
      }
    }
    return null;
  };

  const getCurrentSubject = () => {
    const currentPeriod = getCurrentPeriod();
    if (!currentPeriod) return null;
    if (currentPeriod.number === "Break" || currentPeriod.number === "Lunch") {
      return {
        code: currentPeriod.number,
        period: currentPeriod,
        isBreak: true,
      };
    }
    // Handle both new faculty-specific structure and legacy structure
    const dayData =
      timetableData?.timetable?.[`Day${currentDayOrder}`] ||
      timetableData?.[`Day${currentDayOrder}`];
    if (!dayData) return null;
    const subjects = dayData.subjects;
    const subjectCode = subjects[currentPeriod.number - 1];
    return {
      code: subjectCode,
      period: currentPeriod,
      isBreak: false,
    };
  };

  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const currentSubject = getCurrentSubject();
  const currentTimeStr = today.toTimeString().slice(0, 5);
  const shouldShowTomorrow = currentTimeStr >= "18:30";

  const getTomorrowDayOrder = () => {
    if (!calendarData) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDayOfWeek = tomorrow.getDay();
      return tomorrowDayOfWeek >= 1 && tomorrowDayOfWeek <= 5
        ? tomorrowDayOfWeek
        : null;
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEntry = calendarData.days.find(
      (d) => d.date === tomorrow.getDate()
    );
    if (tomorrowEntry) {
      if (tomorrowEntry.type === "Working Day" && tomorrowEntry.day_order) {
        return tomorrowEntry.day_order;
      } else {
        return null;
      }
    }
    return null;
  };

  const displayDayOrder = shouldShowTomorrow
    ? getTomorrowDayOrder()
    : currentDayOrder;
  const displayDay = shouldShowTomorrow
    ? new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { weekday: "long" }
      )
    : weekday;
  const dayLabel = shouldShowTomorrow ? "Tomorrow" : "Today";

  return (
    <div className="bg-[#DBE2EF] p-4 sm:p-6 rounded-xl shadow-md mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-[#112D4E] mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-[#3F72AF] rounded-sm mr-2"></span>
        {displayUser.welcomeMessage}
      </h2>

      {/* 🎯 Action Buttons (with Framer Motion animations) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/view-attendance"
            className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md"
          >
            View Attendance
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/internal-marks"
            className="px-4 py-2  bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md"
          >
            Internal Components
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/edit-timetable"
            className="px-4 py-2 block bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md"
          >
            Edit Timetable
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/news"
            className="px-4 py-2 block bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md md:hidden"
          >
            News
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/tools"
            className="px-4 py-2 block bg-[#3F72AF] text-white rounded-lg text-sm font-semibold hover:bg-[#112D4E] transition-colors shadow-sm hover:shadow-md md:hidden"
          >
            Tools
          </Link>
        </motion.div>
      </div>

      {/* 📅 Timetable Card */}
      <div className="w-full">
        <InfoCard
          title="Day Order"
          value={displayDayOrder ? `Day${displayDayOrder}` : "Holiday"}
        >
          {loading ? (
            <div className="text-xs text-gray-500">Loading timetable...</div>
          ) : error ? (
            <div className="text-xs text-red-600">{error}</div>
          ) : !displayDayOrder ? (
            <div className="text-xs text-gray-500 mt-1">
              No classes today - Holiday
            </div>
          ) : timetableData?.timetable?.[`Day${displayDayOrder}`] ||
            timetableData?.[`Day${displayDayOrder}`] ? (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-[300px] w-full text-xs border border-[#DBE2EF] rounded overflow-hidden table-fixed">
                <thead>
                  <tr className="bg-[#3F72AF] text-white">
                    <th className="py-1 px-1 font-semibold w-1/6">P</th>
                    <th className="py-1 px-1 font-semibold w-2/6">Time</th>
                    <th className="py-1 px-1 font-semibold w-3/6">Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {timetableData.periods.map((period, idx) => {
                    const isBreakPeriod =
                      period.number === "Break" || period.number === "Lunch";
                    let displaySubject = "";
                    if (isBreakPeriod) {
                      displaySubject = period.number;
                    } else {
                      const nonBreakPeriods = timetableData.periods
                        .slice(0, idx)
                        .filter((p) => typeof p.number === "number").length;
                      // Handle both new faculty-specific structure and legacy structure
                      const dayData =
                        timetableData.timetable?.[`Day${displayDayOrder}`] ||
                        timetableData[`Day${displayDayOrder}`];
                      const subjectsArr = dayData?.subjects || [];
                      displaySubject = subjectsArr[nonBreakPeriods] || "-";
                    }

                    const isCurrent =
                      !shouldShowTomorrow &&
                      currentSubject &&
                      currentSubject.period &&
                      currentSubject.period.number === period.number;

                    return (
                      <tr
                        key={idx}
                        className={
                          isCurrent
                            ? isBreakPeriod
                              ? "bg-orange-500 text-white"
                              : "bg-[#3F72AF] text-white"
                            : isBreakPeriod
                            ? "bg-orange-100"
                            : "even:bg-[#F9F7F7] odd:bg-white"
                        }
                      >
                        <td className="py-1 px-1 text-center">
                          {typeof period.number === "number"
                            ? period.number
                            : period.number.charAt(0)}
                        </td>
                        <td className="py-1 px-1 text-center text-[9px] sm:text-[10px]">
                          {`${period.startTime} - ${period.endTime}`}
                        </td>
                        <td
                          className={`py-1 px-1 text-center text-[10px] truncate ${
                            isBreakPeriod ? "font-semibold" : ""
                          }`}
                        >
                          {displaySubject}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              No timetable for this day order.
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
}

export default GeneralInfo;
