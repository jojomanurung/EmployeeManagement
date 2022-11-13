const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "./db/db.json"));
const dbEmployee = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./db/db.json"), "UTF-8")
);

const middlewares = jsonServer.defaults();

const SECRET_KEY = "123456789";
const expiresIn = "1h";

const PORT = 3000;

/**
 * Fungsi untuk membuat token auth
 */
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

/**
 * Fungsi untuk verifiakasi token auth
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

/**
 * Fungsi untuk melakukan pengecekan employee ada di DB
 */
function isEmployee({ username, password }) {
  const foundEmployee = dbEmployee.employee.find(
    (employee) =>
      employee.username === username && employee.password === password
  );
  return foundEmployee;
}

/**
 * middleware untuk request authenticated atau tidak
 */
function isAuthenticated(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    const status = 401;
    const message = "Authorization header is missing";
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(token);
    next();
  } catch (err) {
    const status = 401;
    const message = "Error: token is invalid";
    res.status(status).json({ status, message });
  }
}

server.use(middlewares);
server.use(cookieParser());
server.use(jsonServer.bodyParser);

// Post Method untuk api login
server.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = isEmployee({ username, password });

  if (!user) {
    const status = 401;
    const message = "Incorrect username or password";
    res.status(status).json({ status, message });
    return;
  }
  delete user.password;
  const access_token = createToken(user);
  res.cookie('access_token', access_token, { httpOnly: true });
  res.status(200).json({ message: "Logged in!" });
});

// Logout endpoint untuk menghapus token cookie
server.get("/auth/logout", (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logged out!" });
});

// Endpoint untuk mendapatkan data user login dari auth
server.get("/current/user", isAuthenticated, (req, res) => {
  const token = req.cookies.access_token;
  try {
    const data = verifyToken(token);
    res.status(200).json({ data })
  } catch (err) {
    const status = 401;
    const message = "Error: token is invalid";
    res.status(status).json({ status, message });
  }
});

server.use("/api", isAuthenticated, router);
server.listen(PORT, () => {
  console.log("JSON Server is running at", `http://localhost:${PORT}`);
});
