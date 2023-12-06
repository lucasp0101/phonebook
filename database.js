const contact = require('./models/contact');
const Contact = require('./models/contact')
const mongoose = require('mongoose');

const fetchAllContacts = () => {
    return Contact.find({})
}

const fetchContactById = (id) => {
    return Contact.find({ _id : id })
}

const fetchContactByName = (name) => {
    return Contact.find({ name : name })
}

const addContact = (contact) => {
    return Contact.create(contact)
}

const deleteContact = (id) => {
    return contact.findByIdAndDelete(id)
}

const updateContact = (id, name, number) => {
    return Contact.updateOne({ _id : id }, { name : name, number : number })
}

module.exports = {
    fetchAllContacts,
    fetchContactById,
    fetchContactByName,
    addContact,
    deleteContact,
    updateContact
}