import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditTimetable() {
  const { user } = useAuth();
  const [timetableData, setTimetableData] = useState(null);
  const [timetable, setTimetable] = useState({});
  const [subjects, setSubjects] = useState({});
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Day1");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchTimetableData();
    fetchCourseData(); // Load course data for subject options
  }, [user?.email]);

  const fetchCourseData = async () => {
    try {
      const basePath =
        import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL;
      const response = await fetch(`${basePath}/courses.json`);
      const data = await response.json();

      // Convert course data to subjects format for timetable
      const subjectsFromCourses = {};
      if (data.courses) {
        data.courses.forEach((course) => {
          subjectsFromCourses[course.course_code] = {
            name: course.course_name,
            fullName: course.course_name,
            code: course.course_code,
            instructor: course.instructor?.name || "Faculty",
            credits: course.credits || 3,
          };
        });
      }

      // Add common subject abbreviations
      const commonSubjects = {
        ASSP: {
          name: "Advanced Server Side Programming",
          fullName: "Advanced Server Side Programming",
          code: "ASSP",
          instructor: "Faculty",
          credits: 4,
        },
        Devops: {
          name: "DevOps",
          fullName: "DevOps",
          code: "Devops",
          instructor: "Faculty",
          credits: 3,
        },
        DCN: {
          name: "Data Communications and Network",
          fullName: "Data Communications and Network",
          code: "DCN",
          instructor: "Faculty",
          credits: 4,
        },
        ML: {
          name: "Machine Learning",
          fullName: "Machine Learning",
          code: "ML",
          instructor: "Faculty",
          credits: 4,
        },
        SE: {
          name: "Software Engineering",
          fullName: "Software Engineering",
          code: "SE",
          instructor: "Faculty",
          credits: 3,
        },
        "": {
          name: "Free Period",
          fullName: "Free Period",
          code: "",
          instructor: "",
          credits: 0,
        },
      };

      setSubjects({ ...subjectsFromCourses, ...commonSubjects });
    } catch (error) {
      // console.error("Error fetching course data:", error);
      // Fallback subjects if course data fails to load
      setSubjects({
        ASSP: {
          name: "Advanced Server Side Programming",
          fullName: "Advanced Server Side Programming",
          code: "ASSP",
          instructor: "Faculty",
          credits: 4,
        },
        Devops: {
          name: "DevOps",
          fullName: "DevOps",
          code: "Devops",
          instructor: "Faculty",
          credits: 3,
        },
        DCN: {
          name: "Data Communications and Network",
          fullName: "Data Communications and Network",
          code: "DCN",
          instructor: "Faculty",
          credits: 4,
        },
        ML: {
          name: "Machine Learning",
          fullName: "Machine Learning",
          code: "ML",
          instructor: "Faculty",
          credits: 4,
        },
        SE: {
          name: "Software Engineering",
          fullName: "Software Engineering",
          code: "SE",
          instructor: "Faculty",
          credits: 3,
        },
        "": {
          name: "Free Period",
          fullName: "Free Period",
          code: "",
          instructor: "",
          credits: 0,
        },
      });
    }
  };

  const fetchTimetableData = async () => {
    try {
      const basePath =
        import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL;
      const response = await fetch(`${basePath}/timetable.json`);
      const data = await response.json();
      setTimetableData(data);

      // Check if this is the new faculty-specific structure
      if (data.timetables && user?.email) {
        // Get faculty-specific timetable based on user email
        const facultyTimetable = data.timetables[user.email];
        if (facultyTimetable) {
          setTimetable(facultyTimetable);
          setPeriods(data.periods); // Use common periods structure
        } else {
          // Fallback: Use the first available faculty timetable as placeholder
          const firstFacultyEmail = Object.keys(data.timetables)[0];
          if (firstFacultyEmail) {
            setTimetable(data.timetables[firstFacultyEmail]);
            setPeriods(data.periods);
            // console.warn(
            //   `No timetable found for ${user.email}, using ${firstFacultyEmail} as fallback`
            // );
          } else {
            // Create empty timetable structure
            const emptyTimetable = {
              Day1: { subjects: ["", "", "", "", "", ""] },
              Day2: { subjects: ["", "", "", "", "", ""] },
              Day3: { subjects: ["", "", "", "", "", ""] },
              Day4: { subjects: ["", "", "", "", "", ""] },
              Day5: { subjects: ["", "", "", "", "", ""] },
            };
            setTimetable(emptyTimetable);
            setPeriods(data.periods || []);
          }
        }
      } else {
        // Legacy single timetable structure - check if data has the expected structure
        if (data.timetable && data.subjects && data.periods) {
          setTimetable(data.timetable);
          setPeriods(data.periods);
        } else {
          // Handle case where timetable data is directly available
          if (data.timetables) {
            // If we have timetables but no user email, use first available
            const firstFacultyEmail = Object.keys(data.timetables)[0];
            if (firstFacultyEmail) {
              setTimetable(data.timetables[firstFacultyEmail]);
            }
          }
          setPeriods(data.periods || []);
        }
      }
    } catch (error) {
      // console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToServer = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      // For demo purposes, just simulate a successful save
      // In production, this would save to the backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      setSaveMessage(
        "✅ Timetable saved successfully! (Demo mode - changes not persisted)"
      );
      setTimeout(() => setSaveMessage(""), 5000);
    } catch (error) {
      // console.error("Error saving timetable:", error);
      setSaveMessage("❌ Failed to save timetable. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F9F7F7] rounded-lg border border-[#DBE2EF] shadow p-6 max-w-4xl mx-auto mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F72AF] mx-auto mb-4"></div>
            <p className="text-[#3F72AF]">Loading timetable...</p>
          </div>
        </div>
      </div>
    );
  }

  const days = Object.keys(timetable || {});
  const subjectOptions = Object.keys(subjects || {});
  const classPeriods = (periods || []).filter(
    (p) => typeof p.number === "number"
  );

  const handleDayChange = (e) => setSelectedDay(e.target.value);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(timetable[selectedDay]?.subjects?.[index] || "");
  };

  const handleEditChange = (e) => setEditValue(e.target.value);

  const handleEditSave = (index) => {
    const updated = { ...timetable };
    if (updated[selectedDay] && updated[selectedDay].subjects) {
      updated[selectedDay].subjects[index] = editValue;
      setTimetable(updated);
    }
    setEditIndex(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#112D4E] tracking-tight">
          Timetable Editor
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage class schedules and subject assignments
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-[#F9F7F7] rounded-lg shadow-md border border-[#DBE2EF] p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Day Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-[#3F72AF] uppercase tracking-wide">
              Select Day:
            </label>
            <select
              value={selectedDay}
              onChange={handleDayChange}
              className="px-4 py-2 border border-[#DBE2EF] rounded-lg bg-white text-[#112D4E] font-medium focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-transparent min-w-[120px]"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500 hidden sm:inline">
              • Currently editing {selectedDay}
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={saveToServer}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              saving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#3F72AF] hover:bg-[#112D4E] text-white shadow-sm hover:shadow-md cursor-pointer"
            }`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="fas fa-save"></i>
                Save Changes
              </span>
            )}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              saveMessage.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {saveMessage}
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="bg-[#F9F7F7] rounded-lg shadow-md border border-[#DBE2EF] p-6">
        <h3 className="text-xl font-bold text-[#112D4E] mb-6">
          Schedule for {selectedDay}
        </h3>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#3F72AF] text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Time Slot
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Subject Assignment
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#DBE2EF]">
                {classPeriods.map((period, idx) => {
                  const subjectCode =
                    timetable &&
                    timetable[selectedDay] &&
                    timetable[selectedDay].subjects
                      ? timetable[selectedDay].subjects[idx] || ""
                      : "";
                  const subject =
                    subjects && subjects[subjectCode]
                      ? subjects[subjectCode]
                      : null;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#DBE2EF] rounded-full flex items-center justify-center">
                            <span className="text-[#3F72AF] font-bold text-sm">
                              {period.number}
                            </span>
                          </div>
                          <span className="font-semibold text-[#112D4E]">
                            Period {period.number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-medium">
                          {period.startTime} - {period.endTime}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editIndex === idx ? (
                          <select
                            value={editValue}
                            onChange={handleEditChange}
                            className="w-full max-w-md px-3 py-2 border border-[#DBE2EF] rounded-lg bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-transparent"
                          >
                            <option value="">— No Subject Assigned —</option>
                            {subjectOptions.map((subjCode) => (
                              <option key={subjCode} value={subjCode}>
                                {subjects[subjCode].fullName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-3">
                            {subjectCode ? (
                              <>
                                <div className="flex-1">
                                  <div className="font-semibold text-[#112D4E]">
                                    {subject?.fullName || subjectCode}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {subject?.instructor ||
                                      "No instructor assigned"}
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-[#3F72AF] text-white rounded-full text-xs font-semibold">
                                  {subjectCode}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400 italic">
                                No subject assigned
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {editIndex === idx ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSave(idx)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors shadow-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(idx)}
                              className="px-4 py-2 bg-[#DBE2EF] text-[#3F72AF] rounded-lg text-sm font-semibold hover:bg-[#3F72AF] hover:text-white transition-colors shadow-sm"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {classPeriods.map((period, idx) => {
            const subjectCode = timetable[selectedDay]?.subjects[idx] || "";
            const subject = subjects[subjectCode];

            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#DBE2EF] p-4 shadow-sm"
              >
                {/* Period Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3F72AF] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {period.number}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[#112D4E]">
                        Period {period.number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {period.startTime} - {period.endTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject Assignment */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#3F72AF] uppercase tracking-wide mb-2">
                    Subject Assignment
                  </label>
                  {editIndex === idx ? (
                    <select
                      value={editValue}
                      onChange={handleEditChange}
                      className="w-full px-3 py-3 border border-[#DBE2EF] rounded-lg bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-transparent text-base"
                    >
                      <option value="">— No Subject Assigned —</option>
                      {subjectOptions.map((subjCode) => (
                        <option key={subjCode} value={subjCode}>
                          {subjects[subjCode].fullName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {subjectCode ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold text-[#112D4E]">
                              {subject?.fullName || subjectCode}
                            </div>
                            <span className="px-2 py-1 bg-[#3F72AF] text-white rounded text-xs font-semibold">
                              {subjectCode}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {subject?.instructor || "No instructor assigned"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">
                          No subject assigned
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {editIndex === idx ? (
                    <>
                      <button
                        onClick={() => handleEditSave(idx)}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-sm"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(idx)}
                      className="w-full py-3 bg-[#3F72AF] text-white rounded-lg font-semibold hover:bg-[#112D4E] transition-colors shadow-sm"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit Subject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Reference */}
      <div className="mt-8 bg-[#F9F7F7] rounded-lg shadow-md border border-[#DBE2EF] p-6">
        <h3 className="text-xl font-bold text-[#112D4E] mb-4">
          Available Subjects
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {subjectOptions.map((code) => (
            <div
              key={code}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-[#DBE2EF] hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 bg-[#3F72AF] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {code.substring(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#112D4E] mb-1">
                  {subjects[code].fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {subjects[code].instructor} • {code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-blue-600 mt-0.5">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">
              How to use the Timetable Editor:
            </p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li>Select the day you want to modify from the dropdown</li>
              <li>
                Click "Edit" next to any period to change the subject assignment
              </li>
              <li>
                Choose a subject from the dropdown or select "No Subject" to
                clear
              </li>
              <li>
                Click "Save Changes" to apply your modifications permanently
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTimetable;
