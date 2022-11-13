const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jsonServer = require("json-server");

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
 * Fungsi untuk melakukan pengecekan akses login
 */
function isAuthenticated({ email, password }) {
  return (
    dbEmployee.employee.findIndex(
      (employee) => employee.email === email && employee.password === password
    ) !== -1
  );
}

server.use(middlewares);

server.use(jsonServer.bodyParser);

// Post Method untuk api login
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ email, password });
  res.status(200).json({ access_token });
  res.cookie("SESSIONID", access_token, { httpOnly: true, secure: true });
});

// Jika endpoint selain /auth diakses tanpa auth token maka akan throw error 401
server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Authorization header is missing";
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = "Error: token is invalid";
    res.status(status).json({ status, message });
  }
});

server.use("/api", router);
server.listen(PORT, () => {
  console.log("JSON Server is running at", `http://localhost:${PORT}`);
});
