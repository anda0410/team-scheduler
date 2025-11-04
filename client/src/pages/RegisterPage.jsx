import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "회원가입 실패");
      } else {
        setMsg(data.message || "회원가입 성공!");
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
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
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
            minLength={4}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="최소 4자 이상"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "처리 중..." : "가입하기"}
        </button>
      </form>

      {msg && (
        <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
