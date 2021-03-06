const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
app.use(morgan("tiny"));
const cors = require('cors')
app.use(cors())
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    response.send(
            `
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate} (${timeZone})</p>
            </div>`
        )
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    if (body.name === undefined) {
        return response.status(400).json({
            error: "name missing"
        });
    }

    if (body.number === undefined) {
        return response.status(400).json({
            error: "number missing"
        });
    }

    const id = maxId + 1

    const personName = body.name
    const personNumber = body.number
    const person = {
        id : id,
        name: personName,
        number: personNumber

    }
    persons = persons.concat(person)
    response.json(person)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})