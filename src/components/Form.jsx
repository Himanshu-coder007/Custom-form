import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEye, FiLink, FiEdit } from "react-icons/fi";
import { MdOutlinePalette } from "react-icons/md";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableQuestion from "./SortableQuestion";
import Preview from "./Preview";

const Form = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [questions, setQuestions] = useState([
    {
      id: Date.now().toString(),
      type: "text",
      text: "Untitled Question",
      options: [],
      required: false,
    },
  ]);
  const [isPreview, setIsPreview] = useState(false);
  const [theme, setTheme] = useState("purple");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { name: "Purple", value: "purple", bgColor: "bg-purple-100", headerColor: "bg-purple-600" },
    { name: "Blue", value: "blue", bgColor: "bg-blue-100", headerColor: "bg-blue-600" },
    { name: "Green", value: "green", bgColor: "bg-green-100", headerColor: "bg-green-600" },
    { name: "Red", value: "red", bgColor: "bg-red-100", headerColor: "bg-red-600" },
    { name: "Indigo", value: "indigo", bgColor: "bg-indigo-100", headerColor: "bg-indigo-600" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save form state to localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem("formState");
    if (savedForm) {
      const { title, description, questions, theme } = JSON.parse(savedForm);
      setTitle(title);
      setDescription(description);
      setQuestions(questions);
      setTheme(theme || "purple");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "formState",
      JSON.stringify({ title, description, questions, theme })
    );
  }, [title, description, questions, theme]);

  // Add a new question
  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      text: "Untitled Question",
      options: type === "text" || type === "number" ? [] : ["Option 1"],
      required: false,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Update question text
  const updateQuestionText = (id, text) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text } : q))
    );
  };

  // Add an option to a question
  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  };

  // Update an option
  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  // Toggle required field
  const toggleRequired = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    );
  };

  // Duplicate a question
  const duplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now().toString(),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  // Drag and drop logic
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Reset form with confirmation
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setTitle("Untitled Form");
      setDescription("Form description");
      setQuestions([]);
      setTheme("purple");
      localStorage.removeItem("formState");
    }
  };

  // Get the current theme colors
  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className={`${currentTheme.bgColor} min-h-screen`}>
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <div className={`${currentTheme.headerColor} text-white p-2 rounded-full`}>📄</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-6 text-gray-600">
          {/* Theme Selector */}
          <div className="relative" ref={dropdownRef}>
            <MdOutlinePalette
              className="text-lg cursor-pointer"
              onClick={() => setIsThemeDropdownOpen((prev) => !prev)}
            />
            {isThemeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {themes.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setIsThemeDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Toggle between Edit and Preview modes */}
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="text-lg cursor-pointer"
          >
            {isPreview ? <FiEdit /> : <FiEye />}
          </button>
          <FiLink className="text-lg cursor-pointer" />
          <button className={`${currentTheme.headerColor} text-white px-4 py-1 rounded`}>
            Publish
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        {isPreview ? (
          <Preview title={title} description={description} questions={questions} />
        ) : (
          <>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-gray-500 border-none focus:outline-none mt-2"
            />

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={questions} strategy={verticalListSortingStrategy}>
                {questions.map((question) => (
                  <SortableQuestion
                    key={question.id}
                    question={question}
                    updateQuestionText={updateQuestionText}
                    updateOption={updateOption}
                    addOption={addOption}
                    removeQuestion={removeQuestion}
                    toggleRequired={toggleRequired}
                    duplicateQuestion={duplicateQuestion}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Add Question Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["text", "number", "radio", "checkbox", "dropdown"].map((type) => (
                <button
                  key={type}
                  onClick={() => addQuestion(type)}
                  className="flex items-center gap-2 text-blue-600 text-sm border px-3 py-1 rounded-md"
                >
                  <FaPlus /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Reset Form Button */}
            <div className="mt-6">
              <button
                onClick={resetForm}
                className="text-red-600 text-sm underline"
              >
                Reset Form
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Form;