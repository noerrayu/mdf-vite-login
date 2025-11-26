import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";

const app = express();
app.use(express.json());
app.use(cookieParser());

const SECRET = "MY_SECRET_KEY";
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID"; // <-- replace
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ================================
// CONFIG
// ================================
const COOKIE_DOMAIN = ".mylocal.com";
const COOKIE_SECURE = false; // dev harus false (tanpa https)
// const COOKIE_SECURE = true;       // jika sudah pakai https
const COOKIE_OPTIONS = {
  httpOnly: false, // supaya bisa dibaca frontend
  sameSite: "lax", // bisa diganti none jika https cross-domain
  secure: COOKIE_SECURE,
  domain: COOKIE_DOMAIN,
};

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
// LOCAL LOGIN
// ================================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Fake example authentication
  if (username === "admin" && password === "123") {
    const payload = { username };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    res.cookie("token", token, COOKIE_OPTIONS);
    return res.json({ message: "Login success", token, user: payload });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// ================================
// GOOGLE LOGIN
// ================================
app.post("/google-login", async (req, res) => {
  const { token } = req.body; // FE sends Google token

  try {
    // verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    // Extract useful fields
    const userData = {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    };

    // Create the SAME jwt so FE logic stays consistent
    const jwtToken = jwt.sign(userData, SECRET, { expiresIn: "1h" });

    res.cookie("token", jwtToken, COOKIE_OPTIONS);

    return res.json({
      message: "Google login success",
      token: jwtToken,
      user: userData,
    });
  } catch (error) {
    console.error("Google Verify ERROR:", error);
    return res
      .status(401)
      .json({ message: "Google login failed", error: error.message });
  }
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
