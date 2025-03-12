import React, { useState } from "react";

const Preview = ({ title, description, questions }) => {
  // State to track user responses
  const [responses, setResponses] = useState({});

  // Handle changes in user responses
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle changes in multiple-choice responses (checkboxes)
  const handleCheckboxChange = (questionId, option, isChecked) => {
    setResponses((prev) => {
      const currentResponse = prev[questionId] || [];
      const updatedResponse = isChecked
        ? [...currentResponse, option] // Add option if checked
        : currentResponse.filter((item) => item !== option); // Remove option if unchecked

      return {
        ...prev,
        [questionId]: updatedResponse,
      };
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      {/* Form Title */}
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* Form Description */}
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {/* Questions */}
      {questions.map((question, index) => (
        <div key={question.id} className="mb-6">
          {/* Question Text */}
          <h3 className="text-lg font-medium mb-2">
            {index + 1}. {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>

          {/* Answer Inputs */}
          {question.type === "text" && (
            <input
              type="text"
              placeholder="Your answer"
              className="w-full p-2 border-b focus:outline-none"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          )}
          {question.type === "number" && (
            <input
              type="number"
              placeholder="Your answer"
              className="w-full p-2 border-b focus:outline-none"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          )}
          {question.type === "radio" && (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="mr-2"
                    checked={responses[question.id] === option}
                    onChange={() => handleResponseChange(question.id, option)}
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
          {question.type === "checkbox" && (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`question-${question.id}`}
                    className="mr-2"
                    checked={
                      responses[question.id] &&
                      responses[question.id].includes(option)
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        question.id,
                        option,
                        e.target.checked
                      )
                    }
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
          {question.type === "dropdown" && (
            <select
              className="w-full p-2 border-b focus:outline-none"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            >
              <option value="" disabled>
                Select an option
              </option>
              {question.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Non-Functional Submit Button */}
      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          type="button" // Prevents form submission
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Preview;