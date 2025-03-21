import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 6;

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(savedForms);
  }, []);

  const deleteForm = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      const updatedForms = forms.filter((form) => form.id !== id);
      localStorage.setItem("forms", JSON.stringify(updatedForms));
      setForms(updatedForms);
    }
  };

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Forms</h1>
        <Link
          to="/createform"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
        >
          Create New Form
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search forms..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[20%] p-3 mb-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400 shadow-sm hover:border-gray-400"
      />
      {currentForms.length === 0 ? (
        <p className="text-gray-600">No forms found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentForms.map((form) => (
              <div key={form.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                <p className="text-gray-600 mb-2">{form.description}</p>
                <p className="text-sm text-gray-500 mb-4">Created: {form.createdAt}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/form/${form.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all duration-300"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-all duration-300"
                  >
                    <FaTrash /> Delete
                  </button>
                  <Link
                    to={`/responses/${form.id}`}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-all duration-300"
                  >
                    <FaEye /> View Responses
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            {Array.from({ length: Math.ceil(filteredForms.length / formsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded-md transition-all duration-300 ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Forms;