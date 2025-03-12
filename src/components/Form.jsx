import React, { useState } from "react";
import { FaPlus, FaTrash, FaRegCopy } from "react-icons/fa";
import { Switch } from "@headlessui/react";

const Form = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [questions, setQuestions] = useState([
    { id: 1, text: "Untitled Question", options: ["Option 1"], required: false },
  ]);

  return (
    <div className="bg-purple-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Form Title & Description */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border-none focus:outline-none"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-gray-500 border-none focus:outline-none mt-2"
        />
        
        {/* Question Card */}
        {questions.map((question, index) => (
          <div key={question.id} className="mt-6 bg-white p-4 border-l-4 border-blue-500 shadow-md">
            <input
              type="text"
              value={question.text}
              className="w-full text-lg font-medium border-none focus:outline-none"
            />
            {/* Options */}
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center mt-2">
                <input type="radio" disabled className="mr-2" />
                <input
                  type="text"
                  value={option}
                  className="border-b focus:outline-none"
                />
              </div>
            ))}
            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <button className="text-blue-600 text-sm">Add option</button>
              <div className="flex items-center gap-3">
                <button className="text-gray-500"><FaRegCopy /></button>
                <button className="text-red-500"><FaTrash /></button>
                <Switch
                  checked={question.required}
                  className={`${question.required ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Required</span>
                  <span className={`${question.required ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full transition`} />
                </Switch>
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button className="mt-4 flex items-center gap-2 text-blue-600 text-sm">
          <FaPlus /> Add Question
        </button>
      </div>
    </div>
  );
};

export default Form;
