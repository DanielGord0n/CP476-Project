const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const spotRoutes = require("./routes/spots");
const reservationRoutes = require("./routes/reservations");
const userRoutes = require("./routes/users");

app.use("/api/spots", spotRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "WLUNest Backend is running",
    status: "OK"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});