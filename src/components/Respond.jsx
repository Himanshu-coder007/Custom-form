import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Respond = () => {
  const { formId } = useParams(); // Get formId from the URL
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});

  // Load the published form
  useEffect(() => {
    const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
    const publishedForm = publishedForms.find((form) => form.id === formId);

    if (publishedForm) {
      setForm(publishedForm);
    } else {
      alert("Form not found or not published.");
    }
  }, [formId]);

  // Handle response changes
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (questionId, files) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: files,
    }));
  };

  // Submit the form responses
  const submitResponses = () => {
    const formResponses = {
      formId,
      responses,
      timestamp: new Date().toISOString(),
    };

    const allResponses = JSON.parse(localStorage.getItem("formResponses")) || [];
    allResponses.push(formResponses);
    localStorage.setItem("formResponses", JSON.stringify(allResponses));

    alert("Thank you for submitting the form!");
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
        <p className="text-gray-600 mb-6">{form.description}</p>

        {form.questions.map((question) => (
          <div key={question.id} className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              {question.text} {question.required && <span className="text-red-500">*</span>}
            </label>
            {question.type === "text" && (
              <input
                type="text"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
              />
            )}
            {question.type === "number" && (
              <input
                type="number"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
              />
            )}
            {question.type === "radio" && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="mr-2"
                      required={question.required}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {question.type === "checkbox" && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      name={question.id}
                      value={option}
                      onChange={(e) => {
                        const currentValues = responses[question.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((val) => val !== option);
                        handleResponseChange(question.id, newValues);
                      }}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {question.type === "dropdown" && (
              <select
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
              >
                <option value="">Select an option</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {question.type === "date" && (
              <input
                type="date"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
              />
            )}
            {question.type === "time" && (
              <input
                type="time"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
              />
            )}
            {question.type === "file" && (
              <input
                type="file"
                onChange={(e) => handleFileUpload(question.id, e.target.files)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required={question.required}
                multiple={question.multiple || false}
              />
            )}
          </div>
        ))}

        <button
          onClick={submitResponses}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Respond;