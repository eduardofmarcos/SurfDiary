###### SurfDiary (in development)

# SurfDiary app

### About this project:

This project is developed in mind to register all the the days we surf along our lives. As a surfer myself I always wanted to register the day and conditions of surfing that day in a nice user friendly app.
The app itself is built with node.js, React (in development) and React Native (in development).


### Built With:

* JavaScript
* Node.js
* React (in development)
* React Native (in development)

##### Dependecies:

      //backend:
      {
        "name": "surfdiary",
        "version": "1.0.0",
        "description": "SurfDiary - from surfers to surfers",
        "main": "index.js",
        "scripts": {
          "dev": "nodemon server.js",
          "build": "NODE_ENV=production nodemon server.js",
          "authServer": "nodemon authServer.js",
          "buildauthServer": "NODE_ENV=production nodemon authServer.js",
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/eduardofmarcos/SurfDiary.git"
        },
        "author": "Eduardo Marcos",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/eduardofmarcos/SurfDiary/issues"
        },
        "homepage": "https://github.com/eduardofmarcos/SurfDiary#readme",
        "dependencies": {
          "@babel/polyfill": "^7.8.7",
          "axios": "^0.19.2",
          "bcryptjs": "^2.4.3",
          "body-parser": "^1.19.0",
          "compression": "^1.7.4",
          "cookie-parser": "^1.4.5",
          "cors": "^2.8.5",
          "dotenv": "^8.2.0",
          "express": "^4.17.1",
          "express-mongo-sanitize": "^1.3.2",
          "express-rate-limit": "^5.1.1",
          "helmet": "^3.21.3",
          "hpp": "^0.2.3",
          "html-to-text": "^5.1.1",
          "jsonwebtoken": "^8.5.1",
          "m": "^1.5.6",
          "mongoose": "^5.8.4",
          "morgan": "^1.9.1",
          "multer": "^1.4.2",
          "ndb": "^1.1.5",
          "nodemailer": "^6.4.4",
          "pug": "^2.0.4",
          "sharp": "^0.25.2",
          "slugify": "^1.3.6",
          "stripe": "^8.33.0",
          "validator": "^12.2.0",
          "xss-clean": "^0.1.1"
        },
        "devDependencies": {
          "eslint": "^6.8.0",
          "eslint-config-airbnb": "^18.0.1",
          "eslint-config-prettier": "^6.9.0",
          "eslint-plugin-import": "^2.19.1",
          "eslint-plugin-jsx-a11y": "^6.2.3",
          "eslint-plugin-node": "^11.0.0",
          "eslint-plugin-prettier": "^3.1.2",
          "eslint-plugin-react": "^7.17.0",
          "parcel-bundler": "^1.12.4",
          "prettier": "^1.19.1"
        },
        "engines": {
          "node": "^12"
        }
      }
      
      //web:
      in development
      
      //mobile:
      in development


### How to run the project:

        * backend:
        "scripts": {
                "dev": "nodemon server.js",
                "build": "NODE_ENV=production nodemon server.js",
                "authServer": "nodemon authServer.js",
                "buildauthServer": "NODE_ENV=production nodemon authServer.js",
                "test": "echo \"Error: no test specified\" && exit 1"
              },


