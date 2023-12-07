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
app.get('/api/persons/:id', (request, response, next) => {
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
            next(error)
        })
})

// Add contact
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const name = body.name
    const number = body.number

    const contact = {
        name: name,
        number: number,
    }

    // Add contact to database
    database.addContact(contact)
        .then(contact => {
            response.json(contact)
        })
        .catch(error => {
            next(error)
        })
})

// Delete contact by id
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    // Delete contact from database
    database.deleteContact(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

// Update contact
app.put('/api/persons/:id', (request, response, next) => {
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
            next(error)
        })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${contacts.length} people</p>
    <p>${new Date()}</p>`)
})

// Error handling
const errorHandler = (error, request, response, next) => {
    console.error("uauauau", error.message)
    
    if (error.name === 'CastError') {
        return response.status(400).send({ 
            error: 'malformatted id' 
        })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ 
            error: error.message 
        })
    }
    
    next(error)
}

app.use(errorHandler)