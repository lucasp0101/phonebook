require('dotenv').config();

const PORT = process.env.PORT
const URL = process.env.MONGODB_URI

const Contact = require('./models/contact')
const mongoose = require('mongoose');
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
]

app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(contacts => {
            response.json(contacts)
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
}) 

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number

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

    if (contacts.find(contact => contact.name === name)) {
        return response.status(400).json({ 
            error: 'contact already present' 
        })
    }

    const contact = {
        name: name,
        number: number,
        id: Math.floor(Math.random() * 1000000)
    }

    contacts = contacts.concat(contact)

    response.json(contact)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${contacts.length} people</p>
    <p>${new Date()}</p>`)
})