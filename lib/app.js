const express = require('express');
const app = express();
const positions = require('./routes/positions');
const companies = require('./routes/companies');
const contacts = require('./routes/contacts');
const actionItems = require('./routes/actionItems');
const users = require('./routes/users');
const auth = require('./routes/auth');
const errorhandler = require('./errorhandler');
const path = require( 'path' );
const publicPath = path.resolve( __dirname, '../public' );
const ensureAuth = require('./ensureAuth');
const cors = require('./cors')('*');

module.exports = app
.use(express.static(publicPath))
.use(cors)
.use('/api/auth', auth)
.use('/api/positions', ensureAuth, positions)
.use('/api/companies', ensureAuth, companies)
.use('/api/contacts', ensureAuth, contacts)
.use('/api/actionItems', ensureAuth, actionItems)
.use('/api/users', ensureAuth, users)
.use(errorhandler)
;
