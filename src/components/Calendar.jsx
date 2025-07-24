// Filepath: src/components/calendar.jsx

import React, { useState, useEffect } from "react";
import { startOfMonth, setDate } from "date-fns";

export const MyMonthlyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [calendarItems, setCalendarItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const AvailableCalenderYears = ["2025"];
  const AvailableCalenderMonths = ["6", "7", "8", "9", "10"];

  const isNavigationAllowed = (targetMonth) => {
    const year = targetMonth.getFullYear().toString();
    const month = (targetMonth.getMonth() + 1).toString();
    return (
      AvailableCalenderYears.includes(year) &&
      AvailableCalenderMonths.includes(month)
    );
  };

  const getNextMonth = (currentMonth) => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const getPrevMonth = (currentMonth) => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth;
  };

  const canNavigateNext = () => isNavigationAllowed(getNextMonth(currentMonth));
  const canNavigatePrev = () => isNavigationAllowed(getPrevMonth(currentMonth));

  const handleMonthChange = (newMonth) => {
    if (isNavigationAllowed(newMonth)) setCurrentMonth(newMonth);
  };

  useEffect(() => {
    const loadCalendarData = async (date) => {
      setIsLoading(true);
      setError(null);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      try {
        const basePath =
          import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL;
        const response = await fetch(
          `${basePath}/calendar_${year}_${String(month).padStart(2, "0")}.json`
        );
        if (!response.ok) throw new Error(`Calendar data not found`);
        const data = await response.json();
        const items = [];

        (data.days || []).forEach((day) => {
          const dayDate = new Date(
            setDate(new Date(year, month - 1), day.date)
          );
          if (day.type === "holiday")
            items.push({
              date: new Date(dayDate),
              title: "Holiday",
              type: "holiday",
            });
          if (day.type === "Working Day" && day.day_order) {
            const romanNumerals = ["", "I", "II", "III", "IV", "V"];
            items.push({
              date: new Date(dayDate),
              title: `Day ${romanNumerals[day.day_order] || day.day_order}`,
              type: "day-order",
            });
          }
          (day.events || []).forEach((event) =>
            items.push({
              date: new Date(dayDate),
              title: event.title || event,
              type: "event",
            })
          );
          (day.deadlines || []).forEach((deadline) =>
            items.push({
              date: new Date(dayDate),
              title: deadline.title || deadline,
              type: "deadline",
            })
          );
        });

        // Load manual events from localStorage
        const manualEvents = JSON.parse(
          localStorage.getItem("manualEvents") || "[]"
        );
        manualEvents.forEach((event) => {
          event.date = new Date(event.date); // convert date string back to Date object
        });

        setCalendarItems([...items, ...manualEvents]);
      } catch (err) {
        setError(err.message);
        setCalendarItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendarData(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    const manualEvents = calendarItems.filter((e) => e.manual);
    localStorage.setItem("manualEvents", JSON.stringify(manualEvents));
  }, [calendarItems]);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const generateCalendarCells = () => {
    const first = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const startDay = first.getDay();
    const totalDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;

    return Array.from({ length: totalCells }).map((_, i) => {
      const dayOffset = i - startDay + 1;
      const cellDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        dayOffset
      );
      const isCurrentMonth = cellDate.getMonth() === currentMonth.getMonth();
      const events = calendarItems.filter(
        (item) => formatDate(item.date) === formatDate(cellDate)
      );

      return (
        <div
          key={i}
          className={`h-20 sm:h-24 md:h-28 lg:h-32 border border-gray-200 p-1 flex flex-col transform transition-transform duration-200 ${
            !isCurrentMonth
              ? "bg-[#DBE2EF] text-[#3F72AF]"
              : "bg-[#F9F7F7] hover:bg-[#DBE2EF] hover:scale-[1.03] hover:border-2 hover:border-[#3F72AF]"
          } cursor-pointer`}
          onClick={() => isCurrentMonth && handleDateClick(cellDate, events)}
        >
          <div className="text-[10px] font-bold text-gray-700">
            {cellDate.getDate()}
          </div>
          <div className="flex flex-col overflow-y-auto max-h-[75%]">
            {events.map((item, idx) => (
              <span
                key={idx}
                className={`text-[9px] px-1 py-[1px] rounded truncate ${
                  {
                    holiday: "bg-red-100 text-red-700",
                    "day-order": "bg-blue-100 text-blue-700",
                    event: "bg-green-100 text-green-700",
                    deadline: "bg-yellow-100 text-yellow-700",
                  }[item.type]
                }`}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const handleDateClick = (date, events) => {
    setSelectedDate({ date, events });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setNewEvent("");
    setIsInputFocused(false);
  };

  const addNewEvent = () => {
    if (!newEvent.trim()) return;
    const newEventItem = {
      date: selectedDate.date,
      title: newEvent.trim(),
      type: "event",
      manual: true,
    };
    setCalendarItems([...calendarItems, newEventItem]);
    setSelectedDate((prev) => ({
      ...prev,
      events: [...prev.events, newEventItem],
    }));
    setNewEvent("");
    setIsInputFocused(false);
  };

  const DateModal = () => {
    if (!isModalOpen || !selectedDate) return null;
    const { date, events } = selectedDate;
    return (
      <div
        className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#112D4E] mb-4">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            {events.length > 0 ? (
              <ul className="mb-4 space-y-2">
                {events.map((event, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-800 bg-green-100 px-3 py-1 rounded"
                  >
                    {event.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-4">No events for this day.</p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                onFocus={() => {
                  if (!isInputFocused) {
                    setNewEvent("");
                    setIsInputFocused(true);
                  }
                }}
                onBlur={(e) => {
                  // Only blur if we're not clicking on a button
                  if (!e.relatedTarget || !e.relatedTarget.closest("button")) {
                    setIsInputFocused(false);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addNewEvent();
                  }
                }}
                className="flex-1 border border-gray-300 px-3 py-1 rounded"
                placeholder="Enter event"
                autoFocus
              />
              <button
                onClick={addNewEvent}
                className="bg-[#3F72AF] text-white px-3 py-1 rounded hover:bg-[#112D4E] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="text-[#3F72AF] hover:text-[#112D4E] transition-colors px-3 py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-1 sm:px-4 py-4 sm:py-6 pb-20">
      <div className="bg-white shadow-md rounded-xl p-4 border">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#3F72AF]">
          Academic Calendar
        </h2>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleMonthChange(getPrevMonth(currentMonth))}
            disabled={!canNavigatePrev()}
            className={`px-4 py-2 rounded font-semibold transition-all duration-200 transform ${
              canNavigatePrev()
                ? "bg-[#3F72AF] text-white hover:scale-105 hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Prev
          </button>
          <span className="text-lg font-medium">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => handleMonthChange(getNextMonth(currentMonth))}
            disabled={!canNavigateNext()}
            className={`px-4 py-2 rounded font-semibold transition-all duration-200 transform ${
              canNavigateNext()
                ? "bg-[#3F72AF] text-white hover:scale-105 hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-white bg-[#3F72AF] rounded-t">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-[#3F72AF] rounded-b overflow-hidden">
          {generateCalendarCells()}
        </div>
      </div>
      <DateModal />
    </div>
  );
};
