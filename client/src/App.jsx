import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FAB from "./components/FAB";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import AdminAnalytics from "./pages/AdminAnalytics";
import JobLibrary from "./pages/JobLibrary";
import ResumeBuilder from "./pages/ResumeBuilder";
import LearningPath from "./pages/LearningPath";
import ATSCheck from "./pages/ATSCheck";
import CoverLetter from "./pages/CoverLetter";
import { api } from "./services/api";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return parsedUser;
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return null;
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthContext.Provider value={{ user, login, logout }}>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                  path="/register"
                  element={user ? <Navigate to="/dashboard" /> : <Register />}
                />
                <Route
                  path="/dashboard"
                  element={user ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/upload"
                  element={user ? <Upload /> : <Navigate to="/login" />}
                />
                <Route
                  path="/analysis/:id"
                  element={user ? <Analysis /> : <Navigate to="/login" />}
                />
                <Route
                  path="/jobs"
                  element={user ? <JobLibrary /> : <Navigate to="/login" />}
                />
                <Route
                  path="/resume-builder"
                  element={user ? <ResumeBuilder /> : <Navigate to="/login" />}
                />
                <Route
                  path="/learning-path/:analysisId"
                  element={user ? <LearningPath /> : <Navigate to="/login" />}
                />
                <Route
                  path="/ats-check"
                  element={user ? <ATSCheck /> : <Navigate to="/login" />}
                />
                <Route
                  path="/cover-letter"
                  element={user ? <CoverLetter /> : <Navigate to="/login" />}
                />
                <Route
                  path="/admin"
                  element={
                    user?.role === "admin" ? (
                      <AdminAnalytics />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
            {user && <FAB />}
          </div>
        </AuthContext.Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
