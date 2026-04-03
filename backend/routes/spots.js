const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM StudySpot";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      data: results
    });
  });
});

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM StudySpot WHERE spot_id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json({
      data: results[0]
    });
  });
});

router.post("/", (req, res) => {
  const {
    building_id,
    spot_code,
    name,
    floor,
    capacity,
    spot_type,
    is_active
  } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  const sql = `
    INSERT INTO StudySpot
    (building_id, spot_code, name, floor, capacity, spot_type, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [building_id, spot_code, name, floor, capacity, spot_type, is_active],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Study spot created",
        id: result.insertId
      });
    }
  );
});

module.exports = router;