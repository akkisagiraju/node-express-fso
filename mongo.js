const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});

const Person = mongoose.model('Note', personSchema);

if (process.argv.length === 5) {
  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];

  const url = `mongodb+srv://fso2020:${password}@cluster0-yzrce.mongodb.net/persons?retryWrites=true&w=majority`;

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

  const person = new Person({
    name,
    number
  });

  person.save().then(_response => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  const password = process.argv[2];
  const url = `mongodb+srv://fso2020:${password}@cluster0-yzrce.mongodb.net/persons?retryWrites=true&w=majority`;

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length < 3) {
  console.log('give password as an argument');
  process.exit(1);
}
