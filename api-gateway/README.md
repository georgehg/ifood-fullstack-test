# iFood Fullstack Test API Gateway

This is a thin API Gateway developed in [NodeJS](https://nodejs.org/en). It uses [express](http://expressjs.com/) framework to exposes API routes to frontend and uses [request](https://www.npmjs.com/package/request) NodeJS too to make HTTP calls and consume the RESTfull services provided by Spring microservices.

This application consolidates the microservices funcionalities, providing one API endpoint for frontend and implementing an orders search processor.

## Installation

In order to properly install and run this application you need to have [NodeJS](https://nodejs.org/en) installed on your machine.

Inside this directory, run `npm install` to download application dependencies.

```js
npm install
```

## Configuration

The server port is defaulted to 5200, but it can be changed creating an environment variable named `GTW_PORT` with another port number.

The microservices host address and ports can be configured editing the file [gateway.json](./app/config/gateway.json). The application will use this file to connect and discover the microservices REST API´s, traversing the endpoints from HAL links.

## Running

After successfully installation, you can startup the application using npm or other tools, like [forever](https://github.com/foreverjs/forever) for example, using the file [server.js](./server.js).

- Using npm

```js
npm start
```

The application can now be accessed by server address followed by the port number:

```js
http://localhost:5200
```