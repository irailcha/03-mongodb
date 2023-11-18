
const HttpError = require('../helpers/HttpError');
const {Contact} = require('../models/Contact');
const contactSchema=require('../schemas/contactSchema')

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (contact) {
    res.json(contact);
  } else {
    throw new HttpError(404, `Contact with id=${id} not found`);
  }
};

const add = async (req, res) => {
  const { error, value } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }

  const { name, email, phone } = value;
  const newContact = new Contact({ name, email, phone });
  
  await newContact.save();

  res.status(201).json(newContact);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);

  if (contact) {
    res.json({ message: 'Contact deleted' });
  } else {
    throw new HttpError(404, `Contact with id=${id} not found`);
  }
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { error, value } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, value, { new: true });

  if (updatedContact) {
    res.json(updatedContact);
  } else {
    throw new HttpError(404, `Contact with id=${id} not found`);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
};