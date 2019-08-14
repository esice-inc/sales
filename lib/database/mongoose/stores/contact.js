const Contact = require('../../../contact');
const ContactModel = require('../../../../db/mongoose/models/contact');

class ContactStore {
  async create(contact) {
    const model = this._objectToModel(contact);

    await model.save();

    return model.id;
  }

  async findById(contactId) {
    const model = await ContactModel.findById(contactId);

    if (!model) throw new errors.ContactModelNotFound(contactId);

    return this._modelToObject(model);
  }

  async findAll() {
    const models = await ContactModel.find();

    return models.map(model => this._modelToObject(model));
  }

  async update(contact) {
    const model = await ContactModel.findById(contact.id);

    if (!model) throw new errors.ContactModelNotFound(contact.id);

    model.name = contact.name;
    model.email = contact.email;
    model.telephone = contact.telephone;

    await model.save();
  }

  _modelToObject(model) {
    let contact = null;

    try {
      contact = new Contact({
        id: model.id,
        name: model.name,
        email: model.email,
        telephone: model.telephone,
      });
    } catch (error) {
      throw new errors.ContactEntityNotCreated(model.id, error.stack);
    }

    return contact;
  }

  _objectToModel(contact) {
    let model = null;

    try {
      model = new ContactModel({
        name: contact.name,
        email: contact.email,
        telephone: contact.telephone,
      });

    } catch (error) {
      throw new errors.ContactModelNotCreated(contact.id, error.stack);
    }

    return model;
  }
}

module.exports = ContactStore;
