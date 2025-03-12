import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./auth/Auth";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import ProtectedRoute from "./ProtectedRoute";
import Form from "./components/Form";
import Forms from "./components/Forms"; // Import the new Forms component
import SingleForm from "./components/SingleForm";
import Respond from "./components/Respond";
import ViewResponses from "./components/Viewresponses";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createform" element={<Form />} /> {/* Create new form */}
          <Route path="/forms" element={<Forms />} /> {/* List of saved forms */}
          <Route path="/form/:formId" element={<SingleForm />} /> {/* Edit existing form */}
          <Route path="/respond/:formId" element={<Respond />} />
          <Route path="/responses/:formId" element={<ViewResponses />} />
        </Route>

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;