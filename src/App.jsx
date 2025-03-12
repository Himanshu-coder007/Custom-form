import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./auth/Auth";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import ProtectedRoute from "./ProtectedRoute";
import Form from "./components/Form";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createform" element={<Form />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
