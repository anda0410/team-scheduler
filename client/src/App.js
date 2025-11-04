import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: '10px' }}>홈</Link>
        <Link to="/register" style={{ marginRight: '10px' }}>회원가입</Link>
        <Link to="/login">로그인</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>메인 페이지입니다!</h2>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
