import React, { useState } from "react";
import { FaPlus, FaTrash, FaRegCopy } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { FiEye, FiLink, FiSettings } from "react-icons/fi";
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
import { SortableItem } from "./SortableItem"; // Create this component

const Form = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [questions, setQuestions] = useState([
    {
      id: "1",
      type: "text",
      text: "Untitled Question",
      options: ["Option 1"],
      required: false,
    },
  ]);

  // Add a new question
  const addQuestion = (type) => {
    const newQuestion = {
      id: `question-${questions.length + 1}`,
      type: type,
      text: "Untitled Question",
      options: type === "text" || type === "number" ? [] : ["Option 1"],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question text
  const updateQuestionText = (id, text) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, text: text } : q
    );
    setQuestions(updatedQuestions);
  };

  // Add an option to a question
  const addOption = (id) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id
        ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
        : q
    );
    setQuestions(updatedQuestions);
  };

  // Update an option
  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  // Toggle required field
  const toggleRequired = (id) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, required: !q.required } : q
    );
    setQuestions(updatedQuestions);
  };

  // Drag and drop logic
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((questions) => {
        const oldIndex = questions.findIndex((q) => q.id === active.id);
        const newIndex = questions.findIndex((q) => q.id === over.id);
        return arrayMove(questions, oldIndex, newIndex);
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
          <button className="hover:text-purple-600">Questions</button>
          <button className="hover:text-purple-600">Responses</button>
          <button className="hover:text-purple-600">Settings</button>
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

        {/* Drag and Drop Context */}
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
              <SortableItem key={question.id} id={question.id}>
                <div className="mt-6 bg-white p-4 border-l-4 border-blue-500 shadow-md">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestionText(question.id, e.target.value)
                    }
                    className="w-full text-lg font-medium border-none focus:outline-none"
                  />
                  {/* Options */}
                  {question.type === "text" && (
                    <input
                      type="text"
                      placeholder="Text answer"
                      className="w-full p-2 border-b focus:outline-none mt-2"
                      disabled
                    />
                  )}
                  {question.type === "number" && (
                    <input
                      type="number"
                      placeholder="Number answer"
                      className="w-full p-2 border-b focus:outline-none mt-2"
                      disabled
                    />
                  )}
                  {(question.type === "radio" ||
                    question.type === "checkbox" ||
                    question.type === "dropdown") &&
                    question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center mt-2">
                        {question.type === "radio" && (
                          <input type="radio" disabled className="mr-2" />
                        )}
                        {question.type === "checkbox" && (
                          <input type="checkbox" disabled className="mr-2" />
                        )}
                        {question.type === "dropdown" && (
                          <select disabled className="mr-2">
                            <option>{option}</option>
                          </select>
                        )}
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(question.id, idx, e.target.value)
                          }
                          className="border-b focus:outline-none"
                        />
                      </div>
                    ))}
                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    {(question.type === "radio" ||
                      question.type === "checkbox" ||
                      question.type === "dropdown") && (
                      <button
                        onClick={() => addOption(question.id)}
                        className="text-blue-600 text-sm"
                      >
                        Add option
                      </button>
                    )}
                    <div className="flex items-center gap-3">
                      <button className="text-gray-500">
                        <FaRegCopy />
                      </button>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                      <Switch
                        checked={question.required}
                        onChange={() => toggleRequired(question.id)}
                        className={`${
                          question.required ? "bg-blue-500" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Required</span>
                        <span
                          className={`${
                            question.required
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        {/* Add Question Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addQuestion("text")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <FaPlus /> Add Text Field
          </button>
          <button
            onClick={() => addQuestion("number")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <FaPlus /> Add Number Field
          </button>
          <button
            onClick={() => addQuestion("radio")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <FaPlus /> Add Radio Buttons
          </button>
          <button
            onClick={() => addQuestion("checkbox")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <FaPlus /> Add Checkboxes
          </button>
          <button
            onClick={() => addQuestion("dropdown")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <FaPlus /> Add Dropdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;