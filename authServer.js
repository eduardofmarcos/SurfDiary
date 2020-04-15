const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authApp = require('./authApp');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB success!'));

const server = authApp.listen(4000, () => {
  console.log('Listening on port 4000...');
});
