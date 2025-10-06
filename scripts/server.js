import express from "express";
import multer from "multer";
import Database from "better-sqlite3";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

const app = express();
const db = new Database("./forum.db");
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname.replace(/\\s+/g, "_");
    cb(null, name);
  },
});
const upload = multer({ storage });

db.prepare(`CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  parentId TEXT,
  user TEXT,
  title TEXT,
  text TEXT,
  image TEXT,
  created INTEGER,
  likes INTEGER
)`).run();

app.get("/api/posts", (req, res) => {
  const rows = db.prepare("SELECT * FROM posts ORDER BY created DESC").all();
  res.json(rows);
});

app.post("/api/posts", upload.single("image"), (req, res) => {
  const { id, parentId, user, title, text } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;
  db.prepare(
    "INSERT INTO posts (id, parentId, user, title, text, image, created, likes) VALUES (?,?,?,?,?,?,?,0)"
  ).run(id, parentId || null, user || "Anon", title, text, image, Date.now());
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
