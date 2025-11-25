import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const SECRET = "MY_SECRET_KEY";

// ================================
// CONFIG
// ================================
const COOKIE_DOMAIN = ".mylocal.com";
const COOKIE_SECURE = false; // dev harus false (tanpa https)
// const COOKIE_SECURE = true;       // jika sudah pakai https

// ================================
// CORS
// ================================
const corsConfig = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://host.mylocal.com:5000",
    "http://remote.mylocal.com:5001",
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
};

app.use(cors(corsConfig));

// ================================
// LOGIN API
// ================================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // contoh verifikasi simpel
  if (username === "admin" && password === "123") {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    return res
      .cookie("token", token, {
        httpOnly: false, // supaya bisa dibaca frontend
        sameSite: "lax", // bisa diganti none jika https cross-domain
        secure: COOKIE_SECURE,
        domain: COOKIE_DOMAIN,
      })
      .json({ message: "Login success", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// ================================
// CHECK LOGIN
// ================================
app.get("/user", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, SECRET);
    return res.json({ loggedIn: true, user: decoded });
  } catch {
    return res.status(401).json({ loggedIn: false });
  }
});

// ================================
// LOGOUT
// ================================
app.post("/logout", (req, res) => {
  return res
    .clearCookie("token", {
      domain: COOKIE_DOMAIN,
      secure: COOKIE_SECURE,
      sameSite: "lax",
    })
    .json({ message: "Logged out" });
});

// ================================
// RUN SERVER
// ================================
app.listen(3001, () => {
  console.log("Auth server running on http://localhost:3001");
});
