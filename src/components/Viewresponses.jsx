import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewResponses = () => {
  const { formId } = useParams(); // Get formId from the URL
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);

  // Load responses and form data
  useEffect(() => {
    const allResponses = JSON.parse(localStorage.getItem("formResponses")) || [];
    const formResponses = allResponses.filter((response) => response.formId === formId);
    setResponses(formResponses);

    const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || [];
    const publishedForm = publishedForms.find((form) => form.id === formId);
    setForm(publishedForm);
  }, [formId]);

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Responses for: {form.title}</h1>
        <p className="text-gray-600 mb-6">{form.description}</p>

        {responses.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          responses.map((response, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Response #{index + 1}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Submitted on: {new Date(response.timestamp).toLocaleString()}
              </p>
              {form.questions.map((question) => (
                <div key={question.id} className="mb-4">
                  <p className="font-semibold">{question.text}</p>
                  <p className="text-gray-600">
                    {response.responses[question.id] || "No response"}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewResponses;