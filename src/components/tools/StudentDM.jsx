import React, { useEffect, useState } from "react";
import { getStudents } from "../../config/api";

function StudentDM() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data.students || []);
      } catch (err) {
        // console.error("Error fetching data:", err);
        setError(err.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!selectedStudent || !message.trim()) {
      alert("Please select a student and enter a message");
      return;
    }

    // console.log("Message Details:", {
    //   student: selectedStudent,
    //   message: message,
    //   timestamp: new Date().toISOString(),
    // });

    alert(`Message sent to ${selectedStudent.name}`);
    setMessage("");
  };

  if (loading) {
    return (
      <div className="bg-[#DBE2EF] p-4 sm:p-6 rounded-xl shadow-md mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#112D4E] mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-[#3F72AF] rounded-sm mr-2"></span>
          Student Direct Messaging
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-[#3F72AF] border-t-transparent"></div>
          <span className="ml-3 text-[#112D4E]">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#DBE2EF] p-4 sm:p-6 rounded-xl shadow-md mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-[#112D4E] mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-[#3F72AF] rounded-sm mr-2"></span>
        Student Direct Messaging
      </h2>

      {!selectedStudent && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or roll number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-[#3F72AF] rounded-lg bg-[#F9F7F7] text-[#112D4E] focus:ring-2 focus:ring-[#3F72AF] focus:outline-none"
          />
        </div>
      )}

      {!selectedStudent && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#112D4E] mb-1">
            Select Student:
          </label>
          <div className="max-h-40 overflow-y-auto rounded-lg bg-[#F9F7F7] border border-[#3F72AF] divide-y divide-[#DBE2EF]">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-2 px-3 cursor-pointer transition-colors ${
                    selectedStudent?.id === student.id
                      ? "bg-[#DBE2EF]"
                      : "hover:bg-[#DBE2EF]/60"
                  }`}
                >
                  <div className="font-medium text-[#112D4E]">
                    {student.name}
                  </div>
                  <div className="text-sm text-[#3F72AF]">
                    {student.roll_number}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-[#112D4E]/60">
                No students found
              </div>
            )}
          </div>
        </div>
      )}

      {selectedStudent && (
        <div
          className="mb-4 p-3 bg-[#F9F7F7] rounded-lg border border-[#3F72AF] cursor-pointer"
          onClick={() => setSelectedStudent(null)}
        >
          <div className="text-sm text-[#3F72AF] mb-1">
            Selected Student (Click to change )
          </div>
          <div className="font-semibold text-[#112D4E]">
            {selectedStudent.name}
          </div>
          <div className="text-sm text-[#3F72AF]">
            {selectedStudent.roll_number}
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#112D4E] mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full p-3 rounded-lg border border-[#3F72AF] bg-[#F9F7F7] text-[#112D4E] focus:ring-2 focus:ring-[#3F72AF] focus:outline-none resize-none"
          />
        </div>
      )}

      <button
        onClick={handleSendMessage}
        disabled={!selectedStudent || !message.trim()}
        className="w-full px-4 py-2 bg-[#3F72AF] text-[#F9F7F7] rounded-lg font-semibold hover:bg-[#3F72AF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          ></path>
        </svg>
        Send Message
      </button>

      {error && (
        <div className="mt-4 p-3 bg-[#F9F7F7] border border-[#3F72AF] rounded-lg text-sm text-[#112D4E]">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default StudentDM;
