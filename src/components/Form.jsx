import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEye, FiLink } from "react-icons/fi";
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
import Question from "./Question";

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

  // Add a new question
  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(), // Unique ID for each question
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

  // Drag and drop logic
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // Prevent errors if dragged outside

    if (active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="bg-purple-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 text-white p-2 rounded-full">📄</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-6 text-gray-600">
          <MdOutlinePalette className="text-lg cursor-pointer" />
          <FiEye className="text-lg cursor-pointer" />
          <FiLink className="text-lg cursor-pointer" />
          <button className="bg-purple-600 text-white px-4 py-1 rounded">
            Publish
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
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
              <Question
                key={question.id}
                question={question}
                updateQuestionText={updateQuestionText}
                updateOption={updateOption}
                addOption={addOption}
                removeQuestion={removeQuestion}
                toggleRequired={toggleRequired}
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
            onClick={() => setQuestions([])}
            className="text-red-600 text-sm underline"
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
