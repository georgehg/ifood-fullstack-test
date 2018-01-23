/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const express = require('express');
const consign = require('consign');

const app = express();
app.disable('body-parser');

consign({cwd: 'app'})
	.include('services/services.json')
	.then('services')
	.then('api')
	.then('routes')
	.into(app);

module.exports = app;