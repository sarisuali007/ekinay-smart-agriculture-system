const express = require('express');
const cors = require('cors');

const aouthRouter = require('./routes/auth');
const fieldsRouter = require('./routes/fields');
const cropsRouter = require('./routes/crops');
const recommendationsRouter = require('./routes/recommendations');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', aouthRouter);
app.use('/fields', fieldsRouter);
app.use('/crops', cropsRouter);
app.use('/recommendations', recommendationsRouter);

app.get('/', (req, res) => {
    res.send('Ekinay API is running');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});