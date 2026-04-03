const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM Reservation", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json({
      data: results
    });
  });
});

router.post("/", (req, res) => {
  const { user_id, spot_id, start_time, end_time, status } = req.body;

  if (!user_id || !spot_id || !start_time || !end_time) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({
      error: "Start time must be before end time"
    });
  }

  const checkSql = `
    SELECT * FROM Reservation
    WHERE spot_id = ?
    AND (
      start_time < ? AND end_time > ?
    )
  `;

  db.query(checkSql, [spot_id, end_time, start_time], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({
        error: "Time slot already booked"
      });
    }

    const insertSql = `
      INSERT INTO Reservation
      (user_id, spot_id, start_time, end_time, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [user_id, spot_id, start_time, end_time, status],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Reservation created",
          id: result.insertId
        });
      }
    );
  });
});

router.put("/:id", (req, res) => {
  const { start_time, end_time, status } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({
      error: "Start time must be before end time"
    });
  }

  const sql = `
    UPDATE Reservation
    SET start_time = ?, end_time = ?, status = ?
    WHERE reservation_id = ?
  `;

  db.query(sql, [start_time, end_time, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Reservation updated"
    });
  });
});

router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM Reservation WHERE reservation_id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Reservation deleted"
    });
  });
});

module.exports = router;