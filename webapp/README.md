# iFood Fullstack Test Frontend WebApp

Front web Application developed in AngularJS 1.6.

## Installation

In order to properly install and run this application you need to have [NodeJS](https://nodejs.org/en) and [bower](https://bower.io/) installed on your machine.

Inside this directory, run `npm install` to download application dependencies and install bower packages.

```js
npm install
```

## Configuration

The server port is defaulted to 7200, but it can be changed creating an environment variable named `WEB_PORT` with another port number.

Two environment variables can be created to configure the API Gateway address:

- To configure API Gateway host address create variable GTW_HOST
- To configure API Gateway port number create variable GTW_PORT

If this two variables is are not created at server startup, the API Gateway address will be defaulted to `localhost:5200`

## Running

After successfully installation, you can startup the application using npm or other tools, like [forever](https://github.com/foreverjs/forever) for example, using the file [server.js](./src/server/server.js).

- Using npm

```js
npm start
```

The webapp can now be accessed by server address followed by the port number:

```js
http://localhost:5200
```