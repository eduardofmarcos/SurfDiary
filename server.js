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

const server = app.listen(process.env.PORT_SERVER, () => {
  console.log('Listening on port 3000...');
});

//********************** Unhandled Rejections - Start **********************/

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down the application...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Sigterm received: Shutting down gracefully!');
  server.close(() => {
    console.log('Process terminated!');
  });
});

//********************** Unhandled Rejections - End **********************/
