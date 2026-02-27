const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "GET all users",
    data: []
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "Create new user",
    body: req.body
  });
});

module.exports = router;