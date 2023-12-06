require('dotenv').config();

const PORT = process.env.PORT
const URL = process.env.MONGODB_URI

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

console.log('connecting to database...')
mongoose.connect(URL)
  .then(result => {
        console.log('connected to MongoDB')  
    })  
   .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)  
    })


const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)