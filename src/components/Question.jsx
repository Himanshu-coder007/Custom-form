import React from "react";
import { FaTrash, FaRegCopy, FaPlus, FaTimes } from "react-icons/fa";
import { Switch } from "@headlessui/react";

const Question = ({
  question,
  updateQuestionText,
  updateOption,
  addOption,
  removeQuestion,
  toggleRequired,
  duplicateQuestion,
}) => {
  return (
    <div className="mt-6 bg-white p-4 border-l-4 border-blue-500 shadow-md rounded-md">
      {/* Question Text Input */}
      <input
        type="text"
        value={question.text}
        onChange={(e) => updateQuestionText(question.id, e.target.value)}
        className="w-full text-lg font-medium border-none focus:outline-none p-2"
        placeholder="Enter question text..."
      />

      {/* Answer Type Rendering */}
      {question.type === "text" && (
        <input
          type="text"
          placeholder="Short answer"
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

      {/* Options for Multiple Choice, Checkbox, and Dropdown */}
      {(question.type === "radio" ||
        question.type === "checkbox" ||
        question.type === "dropdown") && (
        <div className="mt-2">
          {question.options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              {/* Input Type */}
              {question.type === "radio" && (
                <input type="radio" disabled className="mr-2" />
              )}
              {question.type === "checkbox" && (
                <input type="checkbox" disabled className="mr-2" />
              )}

              {/* Editable Option Text */}
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  updateOption(question.id, idx, e.target.value)
                }
                className="border-b focus:outline-none flex-1 p-1"
              />

              {/* Remove Option Button */}
              {question.options.length > 1 && (
                <button
                  onClick={() => updateOption(question.id, idx, "")}
                  className="text-red-500 text-sm"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          <button
            onClick={() => addOption(question.id)}
            className="mt-2 text-blue-600 text-sm flex items-center gap-1"
          >
            <FaPlus /> Add option
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-3">
          {/* Duplicate Question */}
          <button
            onClick={() => duplicateQuestion(question)}
            className="text-gray-500 hover:text-blue-500"
          >
            <FaRegCopy />
          </button>

          {/* Remove Question */}
          <button
            onClick={() => removeQuestion(question.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>

          {/* Toggle Required */}
          <Switch
            checked={question.required}
            onChange={() => toggleRequired(question.id)}
            className={`${
              question.required ? "bg-blue-500" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span className="sr-only">Required</span>
            <span
              className={`${
                question.required ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Question;