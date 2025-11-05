// server/index.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
      return res
        .status(400)
        .json({ error: 'email과 password를 모두 보내주세요.' });
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

    res.status(201).json({
      message: '회원가입 성공!',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    // 이메일 중복 처리
    if (err.code === '23505') {
      return res.status(409).json({ error: '이미 사용중인 이메일입니다.' });
    }
    console.error(err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일로 유저 찾기
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: '존재하지 않는 이메일입니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, 'secret_key', {
      expiresIn: '1h',
    });

    // 로그인 성공 응답
    res.json({
      message: '로그인 성공!',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('로그인 중 오류:', err);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});
app.delete('/api/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: '인증 토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const userId = decoded.userId;

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: '계정이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error('계정 삭제 오류:', err);
    res.status(500).json({ error: '서버 오류로 계정을 삭제하지 못했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
