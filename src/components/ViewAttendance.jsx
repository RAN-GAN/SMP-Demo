import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath =
      import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL;
    fetch(`${basePath}/students_data.json`)
      .then((response) => response.json())
      .then((data) => {
        const studentList = data.students || [];
        setStudents(studentList);

        // Initialize all students as "Present" by default
        const initialAttendance = {};
        studentList.forEach((student) => {
          initialAttendance[student.roll_number] = "Present";
        });
        setAttendance(initialAttendance);

        setLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching student data:", error);
        setLoading(false);
      });
  }, []);

  // Toggle attendance
  const toggleAttendance = (rollNumber) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: prev[rollNumber] === "Present" ? "Absent" : "Present",
    }));
  };

  // Save attendance as Excel file
  const handleSave = () => {
    const attendanceData = students.map((student) => ({
      "Roll Number": student.roll_number,
      Name: student.name,
      Attendance: attendance[student.roll_number],
    }));

    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#DBE2EF] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-[#112D4E]">
        Mark Attendance
      </h2>

      {loading ? (
        <p className="text-[#3F72AF]">Loading students...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#F9F7F7] rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3F72AF] text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Roll No</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody className="text-[#3F72AF] text-sm font-light">
              {students.map((student) => (
                <tr
                  key={student.roll_number}
                  className="border-b border-[#DBE2EF] hover:bg-[#E3EAF6] transition-colors duration-200"
                >
                  <td className="py-3 px-6 font-semibold">
                    {student.roll_number}
                  </td>
                  <td className="py-3 px-6 font-semibold">{student.name}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className={`px-3 py-1 rounded-md text-white font-semibold shadow ${
                        attendance[student.roll_number] === "Present"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => toggleAttendance(student.roll_number)}
                    >
                      {attendance[student.roll_number]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#3F72AF] text-white rounded-md hover:bg-[#112D4E] font-semibold shadow"
        >
          Save Attendance (Excel)
        </button>
      </div>
    </div>
  );
};

export default ViewAttendance;
