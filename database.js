const Contact = require('./models/contact')
const mongoose = require('mongoose');

const fetchAllContacts = () => {
    return Contact.find({})
}

const fetchContactById = (id) => {
    return Contact.find({ _id : id })
}

const addContact = (contact) => {
    return Contact.create(contact)
}

module.exports = {
    fetchAllContacts,
    fetchContactById,
    addContact
}