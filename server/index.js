// server/index.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config(); // .env 파일 읽기

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 허용
app.use(cors());
app.use(express.json()); // JSON 바디 파싱

// PostgreSQL 연결
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
});

// 간단한 연결 테스트
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 회원가입 API
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email과 password를 모두 보내주세요.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // users 테이블에 저장
    const query = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email, created_at
    `;
    const values = [email, hashedPassword];
    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    res.status(201).json({ message: '회원가입 성공!', user: { id: newUser.id, email: newUser.email } });
  } catch (err) {
    // 이메일 중복 처리
    if (err.code === '23505') {
      return res.status(409).json({ error: '이미 사용중인 이메일입니다.' });
    }
    console.error(err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
