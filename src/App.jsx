import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Home from "./components/Home";
import Students from "./components/students/Students";
import { MyMonthlyCalendar } from "./components/Calendar";
import ProfileComponent from "./components/ProfileComponent";
import InternalMarks from "./components/InternalMarks";
import EditTimetable from "./components/EditTimetable";
import ResearchNews from "./components/ResearchNews";
import Tools from "./components/tools/Tools";
import ViewAttendance from "./components/ViewAttendance";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#DBE2EF]">
        <Header />
        <main className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/calendar" element={<MyMonthlyCalendar />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/internal-marks" element={<InternalMarks />} />
            <Route path="/edit-timetable" element={<EditTimetable />} />
            <Route path="/View-attendance" element={<ViewAttendance />} />
            <Route path="/news" element={<ResearchNews />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
