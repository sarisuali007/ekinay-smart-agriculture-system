require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB bağlantısı başarılı.");
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err.message);
  });

// Routes
const authRouter = require('./routes/auth');  
const usersRouter = require('./routes/users');
const fieldsRouter = require('./routes/fields');
const cropsRouter = require('./routes/crops');
const recommendationsRouter = require('./routes/recommendations');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/fields', fieldsRouter);
app.use('/crops', cropsRouter);
app.use('/recommendations', recommendationsRouter);

app.get('/', (req, res) => {
    res.send('Ekinay API is running');
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});