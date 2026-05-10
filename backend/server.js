require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const fieldsRouter = require("./routes/fields");
const cropsRouter = require("./routes/crops");
const recommendationsRouter = require("./routes/recommendations");
const autoAlertsRoutes = require("./routes/autoAlerts");
const testPushRoutes = require("./routes/testPush");
const rabbitTestRoutes = require("./routes/rabbitTest");

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/fields", fieldsRouter);
app.use("/crops", cropsRouter);
app.use("/recommendations", recommendationsRouter);
app.use("/auto-alerts", autoAlertsRoutes);
app.use("/test-push", testPushRoutes);
app.use("/rabbit-test", rabbitTestRoutes);

app.get("/", (req, res) => {
  res.send("Ekinay API is running");
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB bağlantısı başarılı.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err.message);
  });