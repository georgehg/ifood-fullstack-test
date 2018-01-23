/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const express = require('express');
const consign = require('consign');

const app = express();

consign({cwd: 'app'})
	.include('api')
	.then('routes')
	.into(app);

module.exports = app;