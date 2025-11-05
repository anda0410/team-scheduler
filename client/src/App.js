import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <nav>
        <Link to="/login">로그인</Link> |{" "}
        <Link to="/register">회원가입</Link>
      </nav>
      <hr />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
