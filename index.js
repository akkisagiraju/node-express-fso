const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

let persons = [
  {
    name: 'Bottom Bottompit',
    number: '39-44-5323523',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  },
  {
    name: 'Akhil',
    number: '23424',
    id: 5
  }
];

app.use(cors());
app.use(express.json());

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number missing'
    });
  } else if (persons.map(person => person.name).indexOf(name) > -1) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }
  const newPerson = {
    name,
    number,
    id: Math.floor(Math.random() * 234)
  };
  persons = persons.concat(newPerson);
  res.status(201).send(newPerson);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  res.json(person);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
