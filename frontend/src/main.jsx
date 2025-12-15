import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Receptionist from "./pages/Receptionist";
import Patient from "./pages/Patient";
import Display from "./pages/Display";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Layout from "./components/Layout";
import { store } from "./store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <Provider store={store}>
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

      {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role ={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/receptionist" 
        element={ 
          <ProtectedRoute role={["admin","receptionist"]}>
            <Receptionist />
          </ProtectedRoute>
        } />
        <Route path="/patient" element={<Patient />} />
        <Route path="/display" element={<Display />} />
      </Routes>
      </Layout>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
