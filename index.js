const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/auth', authRouter);
mongoose.connect(process.env.MONGO_URI).then(() => {
          console.log('Connected to MongoDB');
}).catch((err) => {
          console.log(err);
});
app.get('/', (req, res) => {
          res.send('Hello World');
});

app.listen(process.env.PORT, () => {
          console.log('Server is running on port 3000');
});

