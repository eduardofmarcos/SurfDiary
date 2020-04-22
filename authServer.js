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

const server = authApp.listen(process.env.PORT_AUTHSERVER, () => {
  console.log('Listening on port 4000...');
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
