const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "GET all study spots",
    data: []
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: `GET study spot ${req.params.id}`,
    data: {}
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "Create new study spot",
    body: req.body
  });
});

module.exports = router;