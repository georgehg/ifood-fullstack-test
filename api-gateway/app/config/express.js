/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const express = require('express');
const consign = require('consign');
var cors = require('cors');

const app = express();
app.disable('body-parser');
app.use(cors());

consign({cwd: 'app'})
	.include('config/gateway.json')
	.then('services')
	.then('helpers')
	.then('api')
	.then('routes')
	.into(app);

module.exports = app;