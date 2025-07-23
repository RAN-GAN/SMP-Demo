import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PortionsGraph() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Module 1",
      topics: [
        { name: "Web Technologies and Frameworks", completed: false },
        { name: "JSF Architecture", completed: false },
        { name: "CSS Versions", completed: false },
      ],
    },
    {
      id: 2,
      title: "Module 2",
      topics: [
        { name: "Web Services & ORM", completed: false },
        { name: "SOAP-Based Web Services", completed: false },
        { name: "Query", completed: false },
      ],
    },
    {
      id: 3,
      title: "Module 3",
      topics: [
        { name: "Not assigned", completed: false },
        { name: "Not assigned", completed: false },
        { name: "Not assigned", completed: false },
      ],
    },
  ]);

  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [newTopic, setNewTopic] = useState("");

  const modulesPerSlide = 1; // Show 2 modules per slide
  const totalSlides = modules.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const openModal = (moduleId) => setSelectedModuleId(moduleId);
  const closeModal = () => setSelectedModuleId(null);

  const toggleTopic = (moduleId, topicIndex) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic, idx) =>
                idx === topicIndex
                  ? { ...topic, completed: !topic.completed }
                  : topic
              ),
            }
          : module
      )
    );
  };

  const calculateProgress = (module) => {
    const completed = module.topics.filter((t) => t.completed).length;
    return Math.round((completed / module.topics.length) * 100);
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === selectedModuleId
          ? {
              ...module,
              topics: [...module.topics, { name: newTopic, completed: false }],
            }
          : module
      )
    );
    setNewTopic("");
  };

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const ModuleModal = () => {
    if (!selectedModuleId || !selectedModule) return null;
    return (
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {selectedModule.title} Topics
            </h2>
            <button onClick={closeModal} className="text-gray-500 text-2xl">
              ×
            </button>
          </div>

          <ul className="space-y-3 mb-4">
            {selectedModule.topics.map((topic, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{topic.name}</span>
                <input
                  type="checkbox"
                  checked={topic.completed}
                  onChange={() => toggleTopic(selectedModule.id, idx)}
                  className="w-5 h-5"
                />
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add new topic"
              className="flex-1 px-3 py-2 border rounded-lg"
              autoFocus
            />
            <button
              onClick={addTopic}
              className="px-4 py-2 bg-[#3F72AF] text-white rounded-lg hover:bg-[#112D4E]"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-sm font-bold text-[#112D4E] mb-1 flex items-center gap-1">
          <span className="inline-block w-1 h-3 bg-[#3F72AF] rounded-sm"></span>
          Course Progress
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative bg-[#F9F7F7] rounded-lg p-2 border border-[#DBE2EF]">
        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 bg-[#3F72AF] text-white rounded-full flex items-center justify-center hover:bg-[#112D4E] transition-colors text-xs"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 bg-[#3F72AF] text-white rounded-full flex items-center justify-center hover:bg-[#112D4E] transition-colors text-xs"
            >
              →
            </button>
          </>
        )}

        {/* Carousel Content */}
        <div className="overflow-hidden mx-6">
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {modules.map((module, moduleIndex) => {
              const progress = calculateProgress(module);
              return (
                <div key={module.id} className="w-full flex-shrink-0 px-1">
                  <motion.div className="bg-white rounded-lg p-2 shadow-sm border border-[#DBE2EF] hover:shadow-md transition-all duration-300">
                    {/* Module Header */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-bold text-[#112D4E]">
                        {module.title}
                      </h3>
                      <div className="text-sm font-bold text-[#112D4E]">
                        {progress}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#DBE2EF] rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full transition-all duration-500 ${
                          progress >= 80
                            ? "bg-green-500"
                            : progress >= 60
                            ? "bg-blue-500"
                            : progress >= 40
                            ? "bg-yellow-500"
                            : progress >= 20
                            ? "bg-orange-500"
                            : "bg-red-400"
                        }`}
                      ></motion.div>
                    </div>

                    {/* Topics Count */}
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <span className="text-[#3F72AF]">
                        {module.topics.filter((t) => t.completed).length}/
                        {module.topics.length} topics
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => openModal(module.id)}
                      className="w-full px-2 py-1 rounded text-xs font-semibold transition-colors bg-[#3F72AF] text-white hover:bg-[#112D4E]"
                    >
                      View
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-2 space-x-1">
            {modules.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#3F72AF]" : "bg-[#DBE2EF]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compact Stats */}
      <div className="mt-2 grid grid-cols-3 gap-1">
        <div className="bg-[#F9F7F7] rounded p-1 text-center border border-[#DBE2EF]">
          <div className="text-xs font-bold text-[#112D4E]">
            {modules.length}
          </div>
          <div className="text-xs text-[#3F72AF]">Modules</div>
        </div>
        <div className="bg-[#F9F7F7] rounded p-1 text-center border border-[#DBE2EF]">
          <div className="text-xs font-bold text-[#112D4E]">
            {modules.reduce(
              (acc, m) => acc + m.topics.filter((t) => t.completed).length,
              0
            )}
          </div>
          <div className="text-xs text-[#3F72AF]">Done</div>
        </div>
        <div className="bg-[#F9F7F7] rounded p-1 text-center border border-[#DBE2EF]">
          <div className="text-xs font-bold text-[#112D4E]">
            {Math.round(
              (modules.reduce(
                (acc, m) => acc + m.topics.filter((t) => t.completed).length,
                0
              ) /
                modules.reduce((acc, m) => acc + m.topics.length, 0)) *
                100
            ) || 0}
            %
          </div>
          <div className="text-xs text-[#3F72AF]">Total</div>
        </div>
      </div>

      <ModuleModal />
    </div>
  );
}
