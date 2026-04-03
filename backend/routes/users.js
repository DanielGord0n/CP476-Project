const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM User", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { full_name, email, role } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      error: "full_name and email are required"
    });
  }

  const sql = "INSERT INTO User (full_name, email, role) VALUES (?, ?, ?)";

  db.query(sql, [full_name, email, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Insert failed" });
    }

    res.json({
      message: "User created",
      id: result.insertId
    });
  });
});

module.exports = router;