const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

console.log(process.env.DATABASE_PASSWORD);
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
  .then(() => console.log('MongoDB success!'))
  .catch(error => {
    console.log(error);
  });

const server = app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
