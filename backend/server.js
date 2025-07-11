// File: backend/server.js

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const fs        = require("fs");
const sqlite3   = require("sqlite3").verbose();

// Routers
const authRouter           = require("./routes/auth");
const suppliersAuthRouter  = require("./routes/suppliersAuth");
const productsRouter       = require("./routes/products");
const categoriesRouter     = require("./routes/categories");
const ordersRouter         = require("./routes/orders");
const metricsRouter        = require("./routes/metrics");
const bulkRouter           = require("./routes/bulk");
const settingsRouter       = require("./routes/settings");
const paymentsRouter       = require("./routes/payments");
const suppliersRouter      = require("./routes/suppliers");
const dropshipRouter       = require("./routes/dropship");
const messagesRouter       = require("./routes/messages");
const emailLogsRouter      = require("./routes/emailLogs");
const emailTemplatesRouter = require("./routes/emailTemplates");
const newsletterRouter     = require("./routes/newsletter");

const app = express();

// Conectar y migrar DB
const dbFile = path.join(__dirname, "data", "products.db");
const db     = new sqlite3.Database(dbFile, err => {
  if (err) {
    console.error("❌ Error conectando a products.db:", err);
    process.exit(1);
  }
  console.log("✅ Conectado a products.db");

  db.serialize(() => {
    // Tabla suppliers
    db.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        name         TEXT    NOT NULL,
        api_url      TEXT    DEFAULT '',
        config       TEXT    DEFAULT '{}',
        callbackUrl  TEXT    DEFAULT '',
        adminUrl     TEXT    DEFAULT ''
      );
    `);
    // Asegurar columnas adicionales en suppliers
    db.all("PRAGMA table_info(suppliers);", (_, cols) => {
      const names = cols.map(c => c.name);
      if (!names.includes("callbackUrl")) {
        console.log("🔧 Agregando columna callbackUrl a suppliers");
        db.run("ALTER TABLE suppliers ADD COLUMN callbackUrl TEXT;");
      }
      if (!names.includes("adminUrl")) {
        console.log("🔧 Agregando columna adminUrl a suppliers");
        db.run("ALTER TABLE suppliers ADD COLUMN adminUrl TEXT;");
      }
    });

    // Tabla categories
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT    UNIQUE NOT NULL
      );
    `);

    // Tabla subcategories
    db.run(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        name        TEXT    NOT NULL,
        UNIQUE(category_id, name),
        FOREIGN KEY(category_id)
          REFERENCES categories(id)
          ON DELETE CASCADE
      );
    `);
  });
});

// Asegurar carpeta uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.CLIENT_ORIGIN || "http://localhost:3000"
    );
    next();
  },
  express.static(uploadDir)
);

// Ruta de salud
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// OAuth proveedores
app.use("/api/suppliers", suppliersAuthRouter);

// Montar routers de API
app.use("/api/login",           authRouter);
app.use("/api/products",        productsRouter);
app.use("/api/categories",      categoriesRouter);
app.use("/api/orders",          ordersRouter);
app.use("/api/metrics",         metricsRouter);
app.use("/api/bulk",            bulkRouter);
app.use("/api/settings",        settingsRouter);
app.use("/api/payments",        paymentsRouter);
app.use("/api/suppliers",       suppliersRouter);
app.use(dropshipRouter);
app.use("/api/messages",        messagesRouter);
app.use("/api/email-logs",      emailLogsRouter);
app.use("/api/email-templates", emailTemplatesRouter);
app.use("/api/newsletter",      newsletterRouter);

// 404 y manejador de errores
app.use((_, res) => res.status(404).json({ error: "Endpoint not found" }));
app.use((err, _, res, __) => {
  console.error("🔥 Error:", err.stack || err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend escuchando en puerto ${PORT}`));
