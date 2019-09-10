const mongoose = require('mongoose');

const UserStore = require('./stores/user');
const OrganizationStore = require('./stores/organization');
const ContactStore = require('./stores/contact');
const SaleStore = require('./stores/sale');
const QuotationStore = require('./stores/quotation');
const OrderStore = require('./stores/order');
const DeliveryStore = require('./stores/delivery');
const CompanyStore = require('./stores/company');

class MongooseDatabase {
  constructor({
    schema, host, port, user, password, database, options,
  }) {
    this.schema = schema || 'mongodb';
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
    this.connection = null;

    this.connect(options);

    this.users = new UserStore();
    this.organizations = new OrganizationStore();
    this.contacts = new ContactStore();
    this.sales = new SaleStore();
    this.quotations = new QuotationStore();
    this.orders = new OrderStore();
    this.deliveries = new DeliveryStore();
    this.companies = new CompanyStore();
  }

  buildURI() {
    let uri = `${this.schema}://`;

    if (this.user && this.password) {
      uri += `${this.user}:${this.password}@`;
    }

    uri += this.host;

    if (this.port) {
      uri += `:${this.port}`;
    }

    uri += `/${this.database}`;

    return uri;
  }

  connect(options) {
    if (!this.connection) {
      this.connection = mongoose
        .connect(this.buildURI(), options)
        .catch(error =>
          console.log(`Error while connecting to Mongo: ${error}`)
        );
    }

    return this.connection;
  }

  disconnect() {
    if (this.connection) {
      return this.connection
        .then(_ => _.connection.close());
    }
  }
}

module.exports = MongooseDatabase;
