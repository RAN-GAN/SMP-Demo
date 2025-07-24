import React, { useState, useEffect } from "react";

const InternalMarks = () => {
  const [students, setStudents] = useState([]);
  const [focusedInputs, setFocusedInputs] = useState(new Set());
  const [focusedRow, setFocusedRow] = useState(null);

  useEffect(() => {
    // Fetch student data from an API or a local file
    const basePath =
      import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL;
    fetch(`${basePath}/students_data.json`)
      .then((response) => response.json())
      .then((data) => {
        // Use data.students array
        const studentsWithMarks = (data.students || []).map((student) => ({
          ...student,
          internalMarks: student.internalMarks || {
            ca1: 0,
            ca2: 0,
            ca3: 0,
            ca4: 0,
          },
        }));
        setStudents(studentsWithMarks);
      })
      .catch((error) => {
        // console.error("Error fetching student data:", error);
      });
  }, []);

  const handleMarkChange = (rollNumber, component, value) => {
    const newStudents = students.map((student) => {
      if (student.roll_number === rollNumber) {
        const updatedMarks = {
          ...student.internalMarks,
          [component]: value === "" ? "" : parseInt(value, 10) || 0,
        };
        return { ...student, internalMarks: updatedMarks };
      }
      return student;
    });
    setStudents(newStudents);
  };

  const handleInputFocus = (rollNumber, component) => {
    const inputKey = `${rollNumber}-${component}`;
    if (!focusedInputs.has(inputKey)) {
      setFocusedInputs((prev) => new Set(prev).add(inputKey));
      // Clear the input value
      handleMarkChange(rollNumber, component, "");
    }
    // Set the focused row
    setFocusedRow(rollNumber);
  };

  const handleInputBlur = (rollNumber, component) => {
    const inputKey = `${rollNumber}-${component}`;
    setFocusedInputs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(inputKey);
      return newSet;
    });

    // Check if any input in this row is still focused
    const components = ["ca1", "ca2", "ca3", "ca4"];
    const hasAnyFocusedInput = components.some(
      (comp) =>
        focusedInputs.has(`${rollNumber}-${comp}`) &&
        `${rollNumber}-${comp}` !== inputKey
    );

    if (!hasAnyFocusedInput) {
      setFocusedRow(null);
    }
  };

  const handleKeyDown = (e, rollNumber, component) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const components = ["ca1", "ca2", "ca3", "ca4"];
      const currentComponentIndex = components.indexOf(component);
      const currentStudentIndex = students.findIndex(
        (s) => s.roll_number === rollNumber
      );

      let nextRollNumber, nextComponent;

      // If not the last component in the row, move to next component
      if (currentComponentIndex < components.length - 1) {
        nextRollNumber = rollNumber;
        nextComponent = components[currentComponentIndex + 1];
      }
      // If last component and not last student, move to first component of next student
      else if (currentStudentIndex < students.length - 1) {
        nextRollNumber = students[currentStudentIndex + 1].roll_number;
        nextComponent = components[0];
      }
      // If last component of last student, move to first component of first student
      else {
        nextRollNumber = students[0].roll_number;
        nextComponent = components[0];
      }

      // Focus the next input
      const nextInput = document.querySelector(
        `input[data-student="${nextRollNumber}"][data-component="${nextComponent}"]`
      );
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const calculateTotal = (marks) => {
    return Object.values(marks).reduce((acc, mark) => {
      const numericMark =
        typeof mark === "string" && mark === "" ? 0 : parseInt(mark, 10) || 0;
      return acc + numericMark;
    }, 0);
  };

  // Download marks as JSON
  const handleDownload = () => {
    const marksData = students.map((student) => ({
      roll_number: student.roll_number,
      name: student.name,
      internalMarks: student.internalMarks,
      total: calculateTotal(student.internalMarks),
    }));
    const blob = new Blob([JSON.stringify(marksData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "internal_marks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Placeholder for save to backend
  const handleSave = () => {
    alert("Marks saved! (Backend integration required)");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#DBE2EF] min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-[#112D4E]">
        Edit Internal Marks
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#F9F7F7] rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#3F72AF] text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Roll No</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-center">CA1 (10)</th>
              <th className="py-3 px-6 text-center">CA2 (10)</th>
              <th className="py-3 px-6 text-center">CA3 (10)</th>
              <th className="py-3 px-6 text-center">CA4 (10)</th>
              <th className="py-3 px-6 text-center">Total (40)</th>
            </tr>
          </thead>
          <tbody className="text-[#3F72AF] text-sm font-light">
            {students.map((student) => (
              <tr
                key={student.roll_number}
                className={`border-b border-[#DBE2EF] transition-colors duration-200 ${
                  focusedRow === student.roll_number
                    ? "bg-[#3F72AF]/10 border-[#3F72AF] shadow-sm"
                    : "hover:bg-[#E3EAF6]"
                }`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-semibold">
                  {student.roll_number}
                </td>
                <td className="py-3 px-6 text-left font-semibold">
                  {student.name}
                </td>
                <td className="py-3 px-6 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={student.internalMarks.ca1}
                    onChange={(e) =>
                      handleMarkChange(
                        student.roll_number,
                        "ca1",
                        e.target.value
                      )
                    }
                    onFocus={() => handleInputFocus(student.roll_number, "ca1")}
                    onBlur={() => handleInputBlur(student.roll_number, "ca1")}
                    onKeyDown={(e) =>
                      handleKeyDown(e, student.roll_number, "ca1")
                    }
                    data-student={student.roll_number}
                    data-component="ca1"
                    className="w-16 text-center border border-[#3F72AF] rounded-md focus:ring-[#3F72AF] focus:border-[#3F72AF] bg-white"
                  />
                </td>
                <td className="py-3 px-6 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={student.internalMarks.ca2}
                    onChange={(e) =>
                      handleMarkChange(
                        student.roll_number,
                        "ca2",
                        e.target.value
                      )
                    }
                    onFocus={() => handleInputFocus(student.roll_number, "ca2")}
                    onBlur={() => handleInputBlur(student.roll_number, "ca2")}
                    onKeyDown={(e) =>
                      handleKeyDown(e, student.roll_number, "ca2")
                    }
                    data-student={student.roll_number}
                    data-component="ca2"
                    className="w-16 text-center border border-[#3F72AF] rounded-md focus:ring-[#3F72AF] focus:border-[#3F72AF] bg-white"
                  />
                </td>
                <td className="py-3 px-6 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={student.internalMarks.ca3}
                    onChange={(e) =>
                      handleMarkChange(
                        student.roll_number,
                        "ca3",
                        e.target.value
                      )
                    }
                    onFocus={() => handleInputFocus(student.roll_number, "ca3")}
                    onBlur={() => handleInputBlur(student.roll_number, "ca3")}
                    onKeyDown={(e) =>
                      handleKeyDown(e, student.roll_number, "ca3")
                    }
                    data-student={student.roll_number}
                    data-component="ca3"
                    className="w-16 text-center border border-[#3F72AF] rounded-md focus:ring-[#3F72AF] focus:border-[#3F72AF] bg-white"
                  />
                </td>
                <td className="py-3 px-6 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={student.internalMarks.ca4}
                    onChange={(e) =>
                      handleMarkChange(
                        student.roll_number,
                        "ca4",
                        e.target.value
                      )
                    }
                    onFocus={() => handleInputFocus(student.roll_number, "ca4")}
                    onBlur={() => handleInputBlur(student.roll_number, "ca4")}
                    onKeyDown={(e) =>
                      handleKeyDown(e, student.roll_number, "ca4")
                    }
                    data-student={student.roll_number}
                    data-component="ca4"
                    className="w-16 text-center border border-[#3F72AF] rounded-md focus:ring-[#3F72AF] focus:border-[#3F72AF] bg-white"
                  />
                </td>
                <td className="py-3 px-6 text-center font-semibold">
                  {calculateTotal(student.internalMarks)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          className="px-4 py-2 bg-[#3F72AF] text-white rounded-md hover:bg-[#112D4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F72AF] font-semibold shadow hover:cursor-not-allowed"
          // onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-[#F9F7F7] text-[#3F72AF] border border-[#3F72AF] rounded-md hover:bg-[#E3EAF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F72AF] font-semibold shadow"
          onClick={handleDownload}
        >
          Download Marks
        </button>
      </div>
    </div>
  );
};

export default InternalMarks;
