import express from "express";
import bodyParser from "body-parser";
import fs from "fs-extra";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;
const USERS_FILE = "./users.json";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// 📩 Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const users = await loadUsers();

  if (users.find(u => u.username === username)) {
    return res.send("Такой пользователь уже существует!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  await saveUsers(users);

  res.send("Регистрация успешна! <a href='/login.html'>Войти</a>");
});

// 🔑 Авторизация
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = await loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.send("Пользователь не найден!");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Неверный пароль!");

  res.send(`Добро пожаловать, ${username}!`);
});

app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
