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
  Person.find({})
    .then(result => {
      res.json(result.map(person => person.toJSON()));
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (body.name === undefined && body.number === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
    });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(_result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedNumber => {
      res.json(updatedNumber.toJSON());
    })
    .catch(error => next(error));
});

app.get('/info', (req, res) => {
  Person.find({})
    .then(result => {
      res.send(
        `<p>Phonebook has info for ${
          result.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch(error => {
      console.log(error);
      response.status(404).end();
    });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
