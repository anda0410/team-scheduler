import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "로그인 실패");
      } else {
        localStorage.setItem("token", data.token);
        setMsg("🎉 로그인 성공! 이제 시간표 페이지로 이동 가능!");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setMsg("네트워크 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "처리 중..." : "로그인"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      {msg.includes("성공") && (
  <div style={{ marginTop: 20 }}>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        alert("로그아웃 되었습니다!");
        window.location.reload();
      }}
      style={{ marginRight: 10 }}
    >
      로그아웃
    </button>

    <button
      onClick={async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인 후에만 회원탈퇴가 가능합니다!");
          return;
        }

        const res = await fetch("http://localhost:5000/api/user", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          alert("계정이 성공적으로 삭제되었습니다!");
          localStorage.removeItem("token");
          window.location.reload();
        } else {
          alert(`❌ ${data.error}`);
        }
      }}
    >
      회원탈퇴
    </button>
  </div>
)}

    </div>
  );
}
