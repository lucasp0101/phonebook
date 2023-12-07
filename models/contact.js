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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    validate: {
      validator: function(v) {
        return /\d{3}-\d{5}\d*/.test(v) || /\d{2}-\d{6}\d*/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    type: String,
    required: true
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)