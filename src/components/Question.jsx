import React from "react";
import { FaTrash, FaRegCopy } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { SortableItem } from "./SortableItem";

const Question = ({
  question,
  updateQuestionText,
  updateOption,
  addOption,
  removeQuestion,
  toggleRequired,
}) => {
  return (
    <SortableItem key={question.id} id={question.id}>
      <div className="mt-6 bg-white p-4 border-l-4 border-blue-500 shadow-md">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateQuestionText(question.id, e.target.value)}
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
                onChange={(e) => updateOption(question.id, idx, e.target.value)}
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
            <button onClick={() => removeQuestion(question.id)} className="text-red-500">
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
                  question.required ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </SortableItem>
  );
};

export default Question;
