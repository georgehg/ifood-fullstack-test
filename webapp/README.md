# Frontend WebApp

Frontend Web Application developed in [AngularJS 1.6](https://angularjs.org/).

## Installation

In order to properly install and run this application you need to have [NodeJS](https://nodejs.org/en) and [bower](https://bower.io/) installed on your machine.

Inside this directory, run `npm install` to download application dependencies and install bower packages.

```js
npm install
```

## Configuration

The server port is defaulted to 7200, but it can be changed creating an environment variable named `WEB_PORT` with another port number.

### API Gateway Configuration

Two environment variables can be created to configure the API Gateway address:

- Set API Gateway host address creating variable `GTW_HOST`
- Set API Gateway port number creating variable `GTW_PORT`

The API Gateway address will be defaulted to `GTW_HOST=localhost` or `GTW_PORT=5200` in case any of these two variables was not created at server startup.

## Running

After successfully installation, you can startup the application using npm or other tools, like [forever](https://github.com/foreverjs/forever) for example, using the file [server.js](./src/server/server.js).

- Using npm

```js
npm start
```

The webapp can now be accessed by server address followed by the port number:

```js
http://localhost:7200
```