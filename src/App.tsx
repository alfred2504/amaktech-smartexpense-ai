import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function Dashboard() {
  return <h1>Dashboard Page</h1>;
}

function Expenses() {
  return <h1>Expenses Page</h1>;
}

function Reports() {
  return <h1>Reports Page</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/expenses" element={<DashboardLayout><Expenses /></DashboardLayout>} />
      <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/register" element={<h1>Register</h1>} />
    </Routes>
  );
}

export default App;