require('dotenv').config();

const PORT = process.env.PORT

const database = require('./database')
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('dist'))
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
/*
let contacts = [
    { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
    },
    { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
    },
    { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
    },
    { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
    }
]*/

app.get('/api/persons', (request, response) => {
    database.fetchAllContacts()
        .then(contacts => {
            response.json(contacts)
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
}) 

// Get contact by id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    database.fetchContactById(id)
        .then(contact => {
            // If the contact exists, return it, else return 404
            if (contact) {
                response.json(contact)
            }
            response.status(404).end()
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

// Delete contact by id
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    // Delete contact from database
    database.deleteContact(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

// Add/Update contact
app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number

    // Check parameters
    if (!name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if (!number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

    /*
    if (contacts.find(contact => contact.name === name)) {
        return response.status(400).json({ 
            error: 'contact already present' 
        })
    }
    */

    const contact = {
        name: name,
        number: number,
        id: Math.floor(Math.random() * 1000000)
    }

    // Add contact to database
    database.addContact(contact)
        .then(contact => {
            response.json(contact)
            contacts = contacts.concat(contact)
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    const name = body.name
    const number = body.number

    // Check parameters
    if (!name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if (!number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

    // Update contact in database
    database.updateContact(id, name, number)
        .then(() => {
            response.status(200).end()
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${contacts.length} people</p>
    <p>${new Date()}</p>`)
})