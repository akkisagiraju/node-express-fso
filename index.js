const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result.map(person => person.toJSON()));
  });
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (body.name === undefined && body.number === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON());
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON());
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
