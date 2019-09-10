const Entity = require('./entity');
const Organization = require('./organization');

class User extends Entity {
  constructor({ id, name, email, organizations = [] }) {
    super({ id, name });

    this.email = email;
    this.organizations = [];

    organizations.map(
      organization => this.addOrganization(organization)
    );
  }

  addOrganization(organization) {
    if (!(organization instanceof Organization)) {
      throw new Error('');
    }

    this.organizations.push(organization);
  }
}

module.exports = User;
