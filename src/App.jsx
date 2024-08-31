import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Pastikan Anda telah menginstal SweetAlert2
import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/dashboard-admin";
import DashboardUser from "./pages/dashboard-user";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  useEffect(() => {
    // Periksa apakah token ada di localStorage
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Jika token tidak ada, tampilkan SweetAlert dan arahkan ke halaman login
      Swal.fire({
        title: "Unauthorized",
        text: "Please log in to continue.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/Login");
      });
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/dashboard-user" element={<DashboardUser />} />
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/Register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
