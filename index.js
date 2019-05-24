require('dotenv').config()
const config = require('config');

const api = require('./api/v1');
const databaseFactory = require('./lib/database/factory');

const db = databaseFactory.create(config.database);
const app = api(db);

app.listen(config.api.port)
console.log("Marketplace listening on ", config.api.port);
