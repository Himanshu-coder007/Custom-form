import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash, FaCopy, FaPalette, FaEye, FaLink, FaEdit, FaSave } from "react-icons/fa";
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

const Form = ({ formId, onSave }) => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [questions, setQuestions] = useState(
    formId
      ? [] // Initialize as empty if editing (will be populated in useEffect)
      : [
          {
            id: Date.now().toString(),
            type: "text",
            text: "Untitled Question",
            options: [],
            required: false,
          },
        ]
  );
  const [isPreview, setIsPreview] = useState(false);
  const [theme, setTheme] = useState("purple");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false); 
  const [publishedLink, setPublishedLink] = useState("");
  const dropdownRef = useRef(null);

  const themes = [
    { name: "Purple", value: "purple", bgColor: "bg-purple-100", headerColor: "bg-purple-600", buttonColor: "bg-purple-500 hover:bg-purple-600" },
    { name: "Blue", value: "blue", bgColor: "bg-blue-100", headerColor: "bg-blue-600", buttonColor: "bg-blue-500 hover:bg-blue-600" },
    { name: "Green", value: "green", bgColor: "bg-green-100", headerColor: "bg-green-600", buttonColor: "bg-green-500 hover:bg-green-600" },
    { name: "Red", value: "red", bgColor: "bg-red-100", headerColor: "bg-red-600", buttonColor: "bg-red-500 hover:bg-red-600" },
    { name: "Indigo", value: "indigo", bgColor: "bg-indigo-100", headerColor: "bg-indigo-600", buttonColor: "bg-indigo-500 hover:bg-indigo-600" },
  ];

  // Load form data if formId is provided
  // useEffect(() => {
  //   if (formId) {
  //     const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  //     const formToEdit = savedForms.find((form) => form.id === formId);

  //     if (formToEdit) {
  //       console.log("Form to Edit:", formToEdit); // Debugging
  //       setTitle(formToEdit.title);
  //       setDescription(formToEdit.description);
  //       setQuestions(formToEdit.questions || []); // Ensure questions are loaded
  //       setTheme(formToEdit.theme || "purple");
  //     }
  //   }
  // }, [formId]);
  // Load form data if formId is provided
useEffect(() => {
  if (formId) {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const formToEdit = savedForms.find((form) => form.id === formId);

    if (formToEdit) {
      setTitle(formToEdit.title);
      setDescription(formToEdit.description);
      setQuestions(formToEdit.questions || []);
      setTheme(formToEdit.theme || "purple");
      setIsPublished(formToEdit.published || false);

      // Set the published link if the form is already published
      if (formToEdit.published) {
        setPublishedLink(`http://localhost:5147/respond/${formId}`);
      }
    }
  }
}, [formId]);

  // Save form to local storage
  const saveForm = () => {
    const formData = {
      id: formId || Date.now().toString(),
      title,
      description,
      questions, // Ensure questions are included
      theme,
    };

    console.log("Form Data to Save:", formData); // Debugging

    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const existingFormIndex = savedForms.findIndex((form) => form.id === formData.id);

    if (existingFormIndex !== -1) {
      savedForms[existingFormIndex] = formData; // Update existing form
    } else {
      savedForms.push(formData); // Add new form
    }

    localStorage.setItem("forms", JSON.stringify(savedForms));
    if (onSave) onSave();
    alert("Form saved successfully");
  };

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

  // Publish the form
  // const publishForm = () => {
  //   if (!title || !description || questions.length === 0) {
  //     alert("Please add a title, description, and at least one question before publishing.");
  //     return;
  //   }

  //   const formData = {
  //     id: formId || Date.now().toString(),
  //     title,
  //     description,
  //     questions,
  //     theme,
  //     published: true, // Mark as published
  //   };

  //   // Save to publishedForms
  //   const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
  //   const existingFormIndex = publishedForms.findIndex((form) => form.id === formData.id);

  //   if (existingFormIndex !== -1) {
  //     publishedForms[existingFormIndex] = formData; // Update existing published form
  //   } else {
  //     publishedForms.push(formData); // Add new published form
  //   }

  //   localStorage.setItem("publishedForms", JSON.stringify(publishedForms));

  //   // Save to forms (to update published status)
  //   const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  //   const existingFormIndexInForms = savedForms.findIndex((form) => form.id === formData.id);

  //   if (existingFormIndexInForms !== -1) {
  //     savedForms[existingFormIndexInForms] = formData; // Update existing form
  //   } else {
  //     savedForms.push(formData); // Add new form
  //   }

  //   localStorage.setItem("forms", JSON.stringify(savedForms));

  //   setIsPublished(true); // Update published status in state
  //   alert("Form published successfully!");
  // };

  // Publish the form
const publishForm = () => {
  if (!title || !description || questions.length === 0) {
    alert("Please add a title, description, and at least one question before publishing.");
    return;
  }

  const formData = {
    id: formId || Date.now().toString(),
    title,
    description,
    questions,
    theme,
    published: true, // Mark as published
  };

  // Save to publishedForms
  const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
  const existingFormIndex = publishedForms.findIndex((form) => form.id === formData.id);

  if (existingFormIndex !== -1) {
    publishedForms[existingFormIndex] = formData; // Update existing published form
  } else {
    publishedForms.push(formData); // Add new published form
  }

  localStorage.setItem("publishedForms", JSON.stringify(publishedForms));

  // Save to forms (to update published status)
  const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  const existingFormIndexInForms = savedForms.findIndex((form) => form.id === formData.id);

  if (existingFormIndexInForms !== -1) {
    savedForms[existingFormIndexInForms] = formData; // Update existing form
  } else {
    savedForms.push(formData); // Add new form
  }

  localStorage.setItem("forms", JSON.stringify(savedForms));

  setIsPublished(true); // Update published status in state
  // setPublishedLink(`http://localhost:5173/respond/${formData.id}`); // Set the published link
  setPublishedLink(`https://custom-form-lilac.vercel.app/respond/${formData.id}`);
  alert("Form published successfully!");
};

  // Copy the published link to clipboard
  // const copyLinkToClipboard = () => {
  //   if (publishedLink) {
  //     navigator.clipboard.writeText(publishedLink);
  //     alert("Link copied to clipboard!");
  //   } else {
  //     alert("Form is not published yet.");
  //   }
  // };
  // Copy the published link to clipboard
const copyLinkToClipboard = () => {
  if (isPublished && publishedLink) {
    navigator.clipboard.writeText(publishedLink);
    alert("Link copied to clipboard!");
  } else {
    alert("Form is not published yet.");
  }
};

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
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)));
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
          <div
            className={`${currentTheme.headerColor} text-white p-2 rounded-full`}
          >
            📄
          </div>
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
            <FaPalette
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
            {isPreview ? <FaEdit /> : <FaEye />}
          </button>

          {/* Copy Link Button */}
          <button
            onClick={copyLinkToClipboard}
            className="text-lg cursor-pointer"
            title="Copy Link"
          >
            <FaLink />
          </button>

          <button
            onClick={saveForm}
            className={`${currentTheme.buttonColor} text-white px-4 py-1 rounded flex items-center gap-2 cursor-pointer`}
          >
            <FaSave /> Save
          </button>
          <button
            onClick={publishForm}
            className={`${currentTheme.buttonColor} text-white px-4 py-1 rounded cursor-pointer`}
            disabled={isPublished} // Disable if already published
          >
            {isPublished ? "Published" : "Publish"}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Left Side: Buttons Column (Hidden in Preview Mode) */}
        {!isPreview && (
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-lg sticky top-0 h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add a Question</h3>
            <div className="flex flex-col gap-2">
              {[
                "text",
                "number",
                "radio",
                "checkbox",
                "dropdown",
                "date",
                "time",
                "file",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => addQuestion(type)}
                  className={`flex items-center gap-2 text-white text-sm px-4 py-2 cursor-pointer rounded-md ${currentTheme.buttonColor}`}
                >
                  <FaPlus /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Reset Form Button */}
            <div className="mt-6">
              <button
                onClick={resetForm}
                className="text-red-600 text-sm underline cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          </div>
        )}

        {/* Right Side: Questions */}
        <div
          className={`${
            isPreview ? "w-full" : "w-3/4"
          } bg-white p-6 rounded-lg shadow-lg`}
        >
          {isPreview ? (
            <Preview
              title={title}
              description={description}
              questions={questions}
            />
          ) : (
            <>
              {/* Form Title and Description */}
              <div className="mb-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold border-none focus:outline-none mb-2"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-gray-500 border-none focus:outline-none"
                />
              </div>

              {/* Questions List */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={questions}
                  strategy={verticalListSortingStrategy}
                >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
