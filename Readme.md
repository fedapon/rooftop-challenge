# rooftop-challenge

This challenge is an API project that consist in three endpoint. They can be tested using a collection for  ***Postman***. The collection is on the *example* folder.

### Requirements

Node.js v14+

### Installation

First of all, you have to clone the project using:
```
$ git clone https://github.com/fedapon/rooftop-challenge.git
```

Next, we must install dependencies:

```
$ npm install
```

Before trying to run the app, you must create a ***.env*** file using the ***.env.sample*** file as a guide. In this file you must set the database name, schema, and its credentials too. 

```
EXPRESS_PORT=3000

#docker-compose credentials
POSTGRES_USER=YOUR_USERNAME_POSTGRES_CONTAINER
POSTGRES_PASSWORD=OUR_USERNAME_POSTGRES_CONTAINER
POSTGRES_DB=YOUR_DATABASE_NAME_POSTGRES_CONTAINER

TYPEORM_CONNECTION = postgres
TYPEORM_HOST = localhost
TYPEORM_USERNAME = YOUR_USERNAME
TYPEORM_PASSWORD = YOUR_PASSWORD
TYPEORM_DATABASE = YOUR_DATABASE_NAME
TYPEORM_SCHEMA= rooftop-backend-challenge
TYPEORM_PORT = 5432
TYPEORM_SYNCHRONIZE = false
TYPEORM_LOGGING = false
TYPEORM_ENTITIES = dist/entity/*.js
#to use the dev script uncomment next line, and comment the last one
#TYPEORM_ENTITIES = src/entity/*.ts
```



Now, to compile the typescript code into javascript and start running the app, we can run the next script:

```
$ npm start
```



Finally the API server will be running on http://localhost:3000/



### Reference libraries used in the challenge:

Expressjs - https://expressjs.com/en/5x/api.html

Typeorm - https://typeorm.io

Joi - https://joi.dev/api/?v=17.4.1



### Inspirational and reference links:

https://github.com/Olanetsoft/weather-app-with-nodejs

https://github.com/typeorm/typescript-express-example

https://dev.to/yoshi_yoshi/typeorm-query-builder-with-subquery-490c

https://javascript.info/async-await

https://www.loginradius.com/blog/async/callback-vs-promises-vs-async-await/