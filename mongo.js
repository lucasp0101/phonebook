const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]

const URL = 
    `mongodb+srv://luxus01012002:${password}@fullstack.lggcjo3.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(URL)

contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    })

const Contact = mongoose.model('Contact', contactSchema)

const name = process.argv[3]
const number = process.argv[4]

const contact = new Contact({
    name,
    number,
})

contact.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
})
