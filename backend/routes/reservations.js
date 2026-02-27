const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "GET all reservations",
    data: []
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "Create new reservation",
    body: req.body
  });
});

router.delete("/:id", (req, res) => {
  res.json({
    message: `Delete reservation ${req.params.id}`
  });
});

module.exports = router;