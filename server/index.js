require('dotenv').config();
const express = require('express');
const cors = require("cors");
const db = require('./db');
const apiRoutes = require('./routes/api');

// db.sequelize.sync({force: true}).then(async () => {
//   console.log('Drop and Resync Db');
//   db.init();
// });

var corsOptions = {
  origin: "http://localhost:3000"
};

require('dotenv').config()

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(express.static('build'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`)
})
