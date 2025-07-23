import React from "react";
import GeneralInfo from "./GeneralInfo";
import { MyMonthlyCalendar } from "./Calendar";
import Announcements from "./Announcement";
import BottomNav from "./BottomNav";
import ResearchNews from "./ResearchNews";
import Tools from "./tools/Tools";
function Home() {
  return (
    <div className="min-h-screen bg-[#F9F7F7] pb-16 lg:pb-0">
      <main className="max-w-8xl mx-auto p-2 sm:p-4 space-y-4">
        {/* Mobile: Only GeneralInfo & Announcements */}
        <div className="lg:hidden flex flex-col space-y-4">
          <GeneralInfo />
          <Announcements />
          {/* <ResearchNews /> */}
        </div>

        {/* Large Screen: Three column layout */}
        <div className="hidden lg:flex lg:flex-row lg:space-x-6 lg:items-stretch max-h-full">
          {/* First Column - GeneralInfo & Resources */}
          <div className="flex flex-col space-y-4 lg:w-2/6">
            <GeneralInfo />
            <Tools />
          </div>

          {/* Second Column - Academic Calendar */}
          <div className="lg:w-4/6 flex">
            <div className="bg-[#DBE2EF] p-4 sm:p-6 rounded-xl shadow-md flex-1">
              <MyMonthlyCalendar />
            </div>
          </div>

          {/* Third Column - Announcements & Research News */}
          <div className="flex flex-col space-y-4 lg:w-2/6 ">
            <Announcements />
            <ResearchNews />
          </div>
        </div>

        {/* Horizontal Tools Section - Full Width */}
        <div className="hidden lg:block">{/* <Tools /> */}</div>
      </main>
      <BottomNav />
    </div>
  );
}

export default Home;
